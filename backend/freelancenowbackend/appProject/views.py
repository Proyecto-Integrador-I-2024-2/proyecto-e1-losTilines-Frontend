from rest_framework import generics, status, viewsets
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated
from app.models import Project, Company, ProjectFreelancer, Status, UserCompany, Milestone, Freelancer
from .serializers import *
from django_filters.rest_framework import DjangoFilterBackend
from .filters import *

# Crear proyecto
class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = ProjectFilter

    def perform_create(self, serializer):
        user = self.request.user
        # Verificar si el usuario pertenece al grupo 'Project Manager' o 'Area Admin'
        if (user.groups.filter(name='Freelancer').exists()):
            raise PermissionDenied("You do not have permission to create a project.")

        # Obtener la compañía asociada al usuario
        user_company = UserCompany.objects.filter(user=user).first()
        if user_company is None:
            raise PermissionDenied("The user does not belong to any company.")
        
        # Asignar estado inicial por defecto
        status, _ = Status.objects.get_or_create(name="Pending")  # Obtiene o crea el estado "Started"

        # Guardar el proyecto con el usuario, la compañía y el estado inicial
        serializer.save(user=user, status=status)

class ProjectFreelancerViewSet(viewsets.ModelViewSet):
    queryset = ProjectFreelancer.objects.all()
    permission_classes = [AllowAny] #Change
    serializer_class = ProjectFreelancerSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ProjectsFreelancerFilter

#------------------------------------------------------------------------#

class MilestoneViewSet(viewsets.ModelViewSet):
    queryset = Milestone.objects.all()
    serializer_class = MilestoneSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    #filterset_class = [MilestoneFilter]
    filterset_fields = ['project', 'freelancer']

    def perform_create(self, serializer):
    # Obtenemos el usuario que está realizando la solicitud
        user = self.request.user

        # Verificamos si el usuario es un freelancer
        if not user.groups.filter(name='Freelancer').exists():
            raise PermissionDenied("Only freelancers can create milestones.")

        # Obtenemos el perfil del freelancer asociado al usuario
        try:
            freelancer = Freelancer.objects.get(user=user)
        except Freelancer.DoesNotExist:
            raise ValidationError("Freelancer profile not found.")

        # Buscar el proyecto asociado al freelancer en ProjectFreelancer
        project_freelancer = ProjectFreelancer.objects.filter(freelancer=freelancer).first()

        if not project_freelancer:
            raise ValidationError("You are not assigned to any project.")

        # Creamos el milestone asociándolo automáticamente al freelancer y al proyecto
        serializer.save(freelancer=freelancer, project=project_freelancer.project)
