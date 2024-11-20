from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated
from app.models import Project, Company, ProjectFreelancer, Status, UserCompany, Milestone, Freelancer, User
from app.serializers import ProjectSerializer, ProjectSkillSerializer
from .serializers import *
from django_filters.rest_framework import DjangoFilterBackend
from .filters import *
from appComunication.custom_signals import project_notification, project_interest_notification, project_update
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
        serializer.save(user=user)

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
        
        response = super().partial_update(request, *args, **kwargs) 
        
        non_null_fields = {
            field: value for field, value in request.data.items() if value is not None
        }
        
        print("Non null fields", non_null_fields)
        
        if non_null_fields: 
            changes_summary = ", ".join(
                [f"{field}: {value}" if field == "status" and value != None else field for field, value in non_null_fields.items()]
            )
            message = f"Project {instance.name} updated on {changes_summary}"
        else:
            message = f"Project {instance.name} general change."
            
            
        user_company = UserCompany.objects.filter(user=self.request.user).first()
        if not user_company:
            return []
        
        company = user_company.company
        area = user_company.area

        # Business Manager
        business_manager = User.objects.filter(
            usercompany__company=company,
            groups__name='Business Manager'
        ).first()

        # Area Admin
        admin_area = User.objects.filter(
            usercompany__area=area,
            groups__name='Area Admin'
        ).exclude(pk=business_manager.pk if business_manager else None).first()

        project_manager = instance.user
            
        project_update.send(    
            sender=Project,
            message=message,
            users= [business_manager, admin_area, project_manager]
        )
          
        return response

class ProjectFreelancerViewSet(viewsets.ModelViewSet):
    queryset = ProjectFreelancer.objects.all()
    permission_classes = [IsAuthenticated]  
    serializer_class = ProjectFreelancerSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['project', 'freelancer', 'status']
    
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()  
        
        response = super().partial_update(request, *args, **kwargs)

        print("On partial update")
        
        
        non_null_fields = {
            field: value for field, value in request.data.items() if value is not None
        }
        
        print("Instance is ", instance)
        if non_null_fields: 
            changes_summary = ", ".join(
                [f"{field}: {value}" for field, value in non_null_fields.items()]
            )
            message = f"Project {instance.project.name} updated on {changes_summary}"
        else:
            message = f"Project {instance.project.name} general change."

        project_notification.send(
            sender=ProjectFreelancer,
            instance=instance,
            message=message  
        )
    
        return response
    
    def perform_create(self, serializer):
        
        print("On perform create project freelancer")
        
        response = super().perform_create(serializer)
        
        instance = serializer.instance
        
        message = f"Notice Project interest on {instance.project.name} by freelancer {instance.freelancer.user.email}."
        
        project_interest_notification.send(
            sender=ProjectFreelancer,
            instance=instance,
            message=message  
        )
    
        return response 
    
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