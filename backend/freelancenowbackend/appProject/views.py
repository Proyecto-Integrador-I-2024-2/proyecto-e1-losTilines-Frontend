from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from app.models import Project, Company
from .serializers import ProjectSerializer


class ProjectListForManagersView(generics.ListAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated or not user.groups.filter(name='Project Manager').exists():
            raise PermissionDenied("You do not have permission to view this list.")
        return super().get_queryset()
    

class ProjectListForFreelancersView(generics.ListAPIView):
    serializer_class = ProjectSerializer

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated or not user.groups.filter(name='Freelancer').exists():
            raise PermissionDenied("You do not have permission to view this list.")
        return Project.objects.filter(user=user)  # Proyectos asociados al freelancer

    
class ProjectListForAdminView(generics.ListAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated or not user.groups.filter(name='Area Admin').exists():
            raise PermissionDenied("You do not have permission to view this list.")
        return super().get_queryset()



class ProjectCreateView(generics.CreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def perform_create(self, serializer):
        user = self.request.user

        if not user.is_authenticated:
            raise PermissionDenied("You must be logged in to create a project.")

        if not (user.groups.filter(name='Project Manager').exists() or 
                user.groups.filter(name='Area Admin').exists()):
            raise PermissionDenied("You do not have permission to create a project.")

        # Obtener la compañía asociada al usuario
        try:
            company = Company.objects.filter(user=user).first()
        except Company.DoesNotExist:
            raise PermissionDenied("The user does not belong to any company.")

        # Guardar el proyecto con el usuario y la compañía asociados
        serializer.save(user=user, company=company)