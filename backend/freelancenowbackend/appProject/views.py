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
    filter_backends = [DjangoFilterBackend]
    filterset_class = ProjectFilter

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        user = self.request.user
        if user.groups.filter(name='Freelancer').exists():
            raise PermissionDenied("You do not have permission to create a project.")

        user_company = UserCompany.objects.filter(user=user).first()
        if user_company is None:
            raise PermissionDenied("The user does not belong to any company.")
        
        # Obtiene o crea el estado "Pending"
        status, created = Status.objects.get_or_create(name="Pending")
        
        # Guarda el proyecto con el estado predeterminado
        serializer.save(user=user, status=status)  # Usa 'status' en lugar de 'created'

    def partial_update(self, request, *args, **kwargs):
        user = request.user
        instance = self.get_object()

        # Verificar permisos de modificación
        if user.groups.filter(name='Freelancer').exists():
            raise PermissionDenied("You do not have permission to modify this project.")
        
        return super().partial_update(request, *args, **kwargs)



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
