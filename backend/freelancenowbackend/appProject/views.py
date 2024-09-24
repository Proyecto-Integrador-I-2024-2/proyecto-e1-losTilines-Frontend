from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated
from app.models import Project, Company, ProjectFreelancer, ProjectStatus, UserCompany
from .serializers import ProjectSerializer


# Listar todos los proyectos
class ProjectListView(generics.ListAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]


# Listar proyectos por compañía
class ProjectByCompanyView(generics.ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        company_id = self.kwargs['company_id']
        return Project.objects.filter(company_id=company_id)


# Listar proyectos por freelancer
class ProjectByFreelancerView(generics.ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        project_ids = ProjectFreelancer.objects.filter(freelancer_id=user_id).values_list('project_id', flat=True)
        return Project.objects.filter(id__in=project_ids)


# Listar proyectos para Project Managers
class ProjectListForManagersView(generics.ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user.groups.filter(name='Project Manager').exists():
            raise PermissionDenied("You do not have permission to view this list.")
        return Project.objects.all()


# Listar proyectos para Freelancers
class ProjectListForFreelancersView(generics.ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user.groups.filter(name='Freelancer').exists():
            raise PermissionDenied("You do not have permission to view this list.")
        return Project.objects.filter(user=user)


# Listar proyectos para Area Admins
class ProjectListForAdminView(generics.ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user.groups.filter(name='Area Admin').exists():
            raise PermissionDenied("You do not have permission to view this list.")
        return Project.objects.all()


# Crear proyecto
class ProjectCreateView(generics.CreateAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user

        # Verificar si el usuario pertenece al grupo 'Project Manager' o 'Area Admin'
        if not (user.groups.filter(name='Project Manager').exists() or 
                user.groups.filter(name='Area Admin').exists()):
            raise PermissionDenied("You do not have permission to create a project.")

        # Obtener la compañía asociada al usuario
        user_company = UserCompany.objects.filter(user=user).first()
        if user_company is None:
            raise PermissionDenied("The user does not belong to any company.")
        
        company = user_company.company  # Obtén la compañía de la relación UserCompany

        # Asignar estado inicial por defecto
        status, _ = ProjectStatus.objects.get_or_create(name="Started")  # Obtiene o crea el estado "Started"

        # Guardar el proyecto con el usuario, la compañía y el estado inicial
        serializer.save(user=user, company=company, status=status)