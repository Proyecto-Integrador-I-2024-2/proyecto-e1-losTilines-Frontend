from .serializers import WorkerSerializer, CompanyDetailSerializer
from .filters import WorkerFilter, CompanyFilter
from app.models import User, UserRole, Project, Area, Company, UserCompany
from .serializers import AreaSerializer
from django.contrib.auth.models import Group 
from rest_framework.permissions import AllowAny 
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404

class CompanyDetailViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanyDetailSerializer
    lookup_field = 'id' 
    permission_classes = [AllowAny]

    filter_backends = [DjangoFilterBackend]
    filterset_class = CompanyFilter

class WorkerViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny] 
    queryset = User.objects.filter(is_active=True)
    serializer_class = WorkerSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = WorkerFilter

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        worker = self.get_object()
        
        new_role = request.data.get('role', None)
        is_active = request.data.get('is_active', None)

        # Obtener el rol actual del usuario
        current_role = worker.userrole_set.first()

        # Manejo de Cambio de Rol
        if new_role:
            if current_role and current_role.role.name == 'Area Admin' and new_role == 'Project Manager':
                self.handle_area_admin_to_project_manager(worker, request, new_role)
            
            elif current_role and current_role.role.name == 'Project Manager' and new_role == 'Area Admin':
                self.handle_project_manager_to_area_admin(worker, new_role)
        
        # Manejo de Desactivación de Usuario
        if is_active is not None and not is_active:
            self.handle_deactivation(worker, request)

        # Actualizar información general del usuario
        serializer = self.get_serializer(worker, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def handle_area_admin_to_project_manager(self, worker, request, new_role):
        worker_company = worker.usercompany_set.first()

        # Si tiene un área asignada, necesitamos reasignar el área
        if worker_company and worker_company.area:
            new_admin_id = request.data.get('new_admin_id')
            if not new_admin_id:
                raise ValidationError("You must assign another Area Admin before changing to Project Manager.")

            # Reasignar el área a otro "Area Admin"
            try:
                new_admin = User.objects.get(pk=new_admin_id)
                new_admin_role = UserRole.objects.filter(user=new_admin).first()

                if new_admin_role.role.name != 'Area Admin':
                    raise ValidationError("The new user must have the role of Area Admin.")
                if new_admin.usercompany_set.filter(area__isnull=False).exists():
                    raise ValidationError("The new Admin Area is already managing another area.")

                # Reasignar el área
                worker_company.area.user = new_admin
                worker_company.area.save()

            except User.DoesNotExist:
                raise ValidationError("The new Admin Area is invalid.")

        # Actualizar el grupo del usuario
        try:
            project_manager_group = Group.objects.get(name=new_role)
            worker.groups.clear()  # Limpiar grupos anteriores
            worker.groups.add(project_manager_group)  # Añadir el nuevo grupo
            worker.save()
        except Group.DoesNotExist:
            raise ValidationError(f"The role {new_role} does not exist.")

        # Cambiar el rol a "Project Manager" en UserRole
        current_role = worker.userrole_set.first()
        current_role.role = project_manager_group
        current_role.save()

    def handle_project_manager_to_area_admin(self, worker, new_role):
        current_role = worker.userrole_set.first()

        # Actualizar el grupo del usuario
        try:
            area_admin_group = Group.objects.get(name=new_role)
            worker.groups.clear()  # Limpiar grupos anteriores
            worker.groups.add(area_admin_group)  # Añadir el nuevo grupo
            worker.save()
        except Group.DoesNotExist:
            raise ValidationError(f"The role {new_role} does not exist.")

        # Cambiar el rol a "Area Admin" en UserRole
        current_role.role = area_admin_group
        worker_company = worker.usercompany_set.first()

        # Desasignar el área actual del usuario si tiene
        if worker_company:
            worker_company.area = None
            worker_company.save()

        current_role.save()

    def handle_deactivation(self, worker, request):

        current_role = worker.userrole_set.first()
        
        if current_role.role.name == 'Area Admin':
            worker_company = worker.usercompany_set.first()
            
            if worker_company and worker_company.area:
                new_admin_id = request.data.get('new_admin_id')
                if not new_admin_id:
                    raise ValidationError("You must assign another Admin Area before deactivating this user.")

                # Reasignar el área a otro "Area Admin"
                try:
                    new_admin = User.objects.get(pk=new_admin_id)
                    new_admin_role = UserRole.objects.filter(user=new_admin).first()

                    if new_admin_role.role.name != 'Area Admin':
                        raise ValidationError("The new user must have the Area Admin role.")
                    if new_admin.usercompany_set.filter(area__isnull=False).exists():
                        raise ValidationError("The new Admin Area is already managing another area.")

                    worker_company.area.user = new_admin
                    worker_company.area.save()

                except User.DoesNotExist:
                    raise ValidationError("The new Admin Area is invalid.")

        elif current_role.role.name == 'Project Manager':
            projects = Project.objects.filter(user=worker)
            new_pm_id = request.data.get('new_pm_id')
            if not new_pm_id:
                raise ValidationError("You must assign another Project Manager before deactivating this user.")
            
            # Reasignar los proyectos a otro "Project Manager"
            try:
                new_pm = User.objects.get(pk=new_pm_id)
                new_pm_role = UserRole.objects.filter(user=new_pm).first()

                if new_pm_role.role.name != 'Project Manager':
                    raise ValidationError("The new user must have the Project Manager role.")

                for project in projects:
                    project.user = new_pm
                    project.save()

            except User.DoesNotExist:
                raise ValidationError("The new Project Manager is not valid.")
            
class AreaViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Area.objects.all()
    serializer_class = AreaSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['company', 'user']

    def get_object(self):
        return super().get_object()

    def create(self, request, *args, **kwargs):
        area_name = request.data.get('name')
        company_id = request.data.get('company')
        area_admin_id = request.data.get('user')

        area = self.validate_area(area_name, company_id, area_admin_id)

        user = User.objects.get(id=area_admin_id)
        
        if user.groups.filter(name="Freelancer").exists():
            raise ValueError("This user type cannot be in a company")

        UserCompany.objects.update_or_create(user=user, defaults={'area': area})

        return Response(AreaSerializer(area).data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        area = self.get_object()
        self.delete_area_and_projects(area)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def validate_area(self, area_name, company_id, area_admin_id, area=None):
        # Obtener el Area Admin
        area_admin = get_object_or_404(User, pk=area_admin_id)
        
        # Validar si el Area Admin pertenece a la compañía
        if not area_admin.usercompany_set.filter(company__id=company_id).exists():
            raise ValidationError("El Area Admin debe pertenecer a la compañía especificada.")
        
        # Validar que el Area Admin no tenga un área asignada (a menos que sea el mismo área que se está actualizando)
        # if area_admin.usercompany_set.filter(area__isnull=False).exists() and (area is None or area_admin != area.user):
        #     raise ValidationError("El Area Admin ya tiene un área asignada.")

        # Validar que el nombre del área sea único
        if area is None:  # Para creación
            if Area.objects.filter(name=area_name, company__id=company_id).exists():
                raise ValidationError("El nombre del área ya existe en esta compañía.")
        else:  # Para actualización
            if Area.objects.filter(name=area_name, company__id=company_id).exclude(id=area.id).exists():
                raise ValidationError("El nombre del área ya existe en esta compañía.")

        # Crear o actualizar el área
        if area is None:  # Creación
            area = Area(name=area_name, company_id=company_id, user=area_admin)
            area.save()
        else:  # Actualización
            area.name = area_name
            area.company_id = company_id
            area.user = area_admin
            area.save()

        return area

    def delete_area_and_projects(self, area):
        # Eliminar todos los proyectos relacionados al área
        projects = Project.objects.filter(user__usercompany__area=area)
        projects.delete()

        # Desasociar el Area Admin de su área
        area.user.usercompany_set.filter(area=area).update(area=None)

        # Desasociar a los Project Managers del área
        project_managers = User.objects.filter(usercompany__area=area, userrole__role__name="Project Manager")
        for pm in project_managers:
            pm.usercompany_set.filter(area=area).update(area=None)

        # Eliminar el área
        area.delete()