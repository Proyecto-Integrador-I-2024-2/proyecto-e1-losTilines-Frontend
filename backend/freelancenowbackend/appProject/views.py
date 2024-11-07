from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated
from app.models import Project, Company, ProjectFreelancer, Status, UserCompany, Milestone, Freelancer
from app.serializers import ProjectSerializer, ProjectSkillCreateSerializer
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

        # Verificación adicional para status
        status, created = Status.objects.get_or_create(name="Pending")
        if not status:
            raise PermissionDenied("Status not found or could not be created.")

        serializer.save(user=user, status=status)

    def partial_update(self, request, *args, **kwargs):
        user = request.user
        instance = self.get_object()

        # Verificar permisos de modificación
        if user.groups.filter(name='Freelancer').exists():
            raise PermissionDenied("You do not have permission to modify this project.")

        # Verificación adicional para instance
        if not instance:
            raise PermissionDenied("Project instance not found.")

        # Lógica de actualización adicional si es necesario
        return super().partial_update(request, *args, **kwargs)


class ProjectFreelancerViewSet(viewsets.ModelViewSet):
    queryset = ProjectFreelancer.objects.all()
    permission_classes = [IsAuthenticated]  
    serializer_class = ProjectFreelancerSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['project', 'freelancer', 'status']

    @action(detail=False, methods=['get'])
    def status(self, request):
        status_choices = ProjectFreelancer.get_status_choices()
        return Response(status_choices)

#------------------------------------------------------------------------#

class MilestoneViewSet(viewsets.ModelViewSet):
    queryset = Milestone.objects.all()
    serializer_class = MilestoneSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
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

        # project = request.project
        # print(project)
        # Buscar el proyecto asociado al freelancer en ProjectFreelancer
        # project_freelancer = ProjectFreelancer.objects.filter(project=project).first()

        # if not project_freelancer:
        #     raise ValidationError("Project not found.")

        # Creamos el milestone asociándolo automáticamente al freelancer y al proyecto
        serializer.save(freelancer=freelancer)

class DeliverableViewSet(viewsets.ModelViewSet):
    queryset = Deliverable.objects.all()
    serializer_class = DeliverableSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['milestone', 'milestone__project']

class ProjectSkillViewSet(viewsets.ModelViewSet):
    queryset = ProjectSkill.objects.all()
    serializer_class = ProjectSkillSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['project', 'skill']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ProjectSkillCreateSerializer
        return ProjectSkillSerializer
    
