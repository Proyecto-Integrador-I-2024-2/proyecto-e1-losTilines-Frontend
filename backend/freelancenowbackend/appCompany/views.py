from rest_framework.permissions import AllowAny 
from django_filters.rest_framework import DjangoFilterBackend
from app.models import User, UserRole, Project
from django.contrib.auth.models import Group
from .serializers import WorkerSerializer
from .filters import WorkerFilter
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError 

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
        
        current_role = worker.userrole_set.first()

        if new_role:
            if current_role and current_role.role.name == 'Area Admin' and new_role == 'Project Manager':
                worker_company = worker.usercompany_set.first()
                
                if worker_company and worker_company.area:
                    new_admin_id = request.data.get('new_admin_id')
                    if not new_admin_id:
                        return Response({"detail": "You must assign another Area Admin before changing to Project Manager."}, 
                                        status=status.HTTP_400_BAD_REQUEST)
                    
                    try:
                        new_admin = User.objects.get(pk=new_admin_id)
                        new_admin_role = UserRole.objects.filter(user=new_admin).first()

                        if new_admin_role.role.name != 'Area Admin':
                            raise ValidationError("The new user must have the role of Area Admin.")
                        if new_admin.usercompany_set.filter(area__isnull=False).exists():
                            raise ValidationError("The new Admin Area is already managing another area.")

                        worker_company.area.user = new_admin
                        worker_company.area.save()

                    except User.DoesNotExist:
                        return Response({"detail": "The new Admin Area is invalid."}, 
                                        status=status.HTTP_400_BAD_REQUEST)

                current_role.role = Group.objects.get(name=new_role)
                current_role.save()

            elif current_role and current_role.role.name == 'Project Manager' and new_role == 'Area Admin':
                current_role.role = Group.objects.get(name=new_role)
                worker_company = worker.usercompany_set.first()
                if worker_company:
                    worker_company.area = None
                    worker_company.save()
                current_role.save()

        if is_active is not None and not is_active:
            if current_role.role.name == 'Area Admin':
                worker_company = worker.usercompany_set.first()
                if worker_company and worker_company.area:
                    new_admin_id = request.data.get('new_admin_id')
                    if not new_admin_id:
                        return Response({"detail": "You must assign another Admin Area before deactivating this user."}, 
                                        status=status.HTTP_400_BAD_REQUEST)

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
                        return Response({"detail": "The new Admin Area is invalid."}, 
                                        status=status.HTTP_400_BAD_REQUEST)

            elif current_role.role.name == 'Project Manager':
                projects = Project.objects.filter(user=worker)
                new_pm_id = request.data.get('new_pm_id')
                if not new_pm_id:
                    return Response({"detail": "You must assign another Project Manager before deactivating this user."}, 
                                    status=status.HTTP_400_BAD_REQUEST)
                
                try:
                    new_pm = User.objects.get(pk=new_pm_id)
                    new_pm_role = UserRole.objects.filter(user=new_pm).first()

                    if new_pm_role.role.name != 'Project Manager':
                        raise ValidationError("The new user must have the Project Manager role.")

                    for project in projects:
                        project.user = new_pm
                        project.save()

                except User.DoesNotExist:
                    return Response({"detail": "The new Project Manager is not valid."}, 
                                    status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(worker, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data, status=status.HTTP_200_OK)