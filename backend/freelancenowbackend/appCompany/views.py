from rest_framework import generics, permissions, status
from app.models import Area, User, UserCompany, Project, UserRole
from .serializers import AreaSerializer, GroupSerializer, UserCompanySerializer, UserRoleSerializer
from appAuth.serializers import UserSerializer
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import Group

#Entidades relacionadas con company
    #Company
    #UserCompany
    #Areas


class ListGroupsView(generics.ListAPIView):
    serializer_class = GroupSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Group.objects.all()

class WorkingAreaListView(generics.ListAPIView):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        business_manager = self.request.user
        user_company_instance = UserCompany.objects.filter(user=business_manager).first()

        if user_company_instance is None:
            raise ValidationError("No se encontró la compañía asociada con este Business Manager.")

        return Area.objects.filter(company=user_company_instance.company)

class WorkingAreaDetailView(generics.RetrieveAPIView):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        business_manager = self.request.user
        user_company_instance = UserCompany.objects.filter(user=business_manager).first()

        if user_company_instance is None:
            raise ValidationError("No se encontró la compañía asociada con este Business Manager.")

        # Asegurarse de que el área pertenece a la compañía del Business Manager
        area = super().get_object()
        if area.company != user_company_instance.company:
            raise PermissionDenied("No tienes permiso para ver esta área de trabajo.")

        return area

class WorkingAreaCreationView(generics.CreateAPIView):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        business_manager = self.request.user
        user_company_instance = UserCompany.objects.filter(user=business_manager).first()

        if user_company_instance is None:
            raise ValidationError("No se encontró la compañía asociada con este Business Manager.")

        company = user_company_instance.company
        user_id = self.request.data.get("user")
        if user_id:
            try:
                user = User.objects.get(id=user_id)
                if not user.groups.filter(name='Area Admin').exists():
                    raise ValidationError("El usuario debe pertenecer al grupo 'Area Admin'.")

                if Area.objects.filter(user=user, company=company).exists():
                    raise ValidationError("El usuario ya está administrando un área en esta compañía.")

            except User.DoesNotExist:
                raise ValidationError("El usuario especificado no existe.")
        else:
            raise ValidationError("Se debe proporcionar un usuario.")

        area = serializer.save(company=company, user=user)
        UserCompany.objects.filter(user=user, company=company).update(area=area)

class WorkingAreaUpdateView(generics.UpdateAPIView):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        business_manager = self.request.user
        user_company_instance = UserCompany.objects.filter(user=business_manager).first()

        if user_company_instance is None:
            raise ValidationError("No se encontró la compañía asociada con este Business Manager.")

        company = user_company_instance.company
        area = self.get_object()

        if area.company != company:
            raise PermissionDenied("No tienes permiso para actualizar esta área de trabajo.")

        # Obtener el nuevo usuario del request
        new_user_id = self.request.data.get("user")
        if new_user_id:
            try:
                new_user = User.objects.get(id=new_user_id)
                if not new_user.groups.filter(name='Area Admin').exists():
                    raise ValidationError("El usuario debe pertenecer al grupo 'Area Admin'.")

                UserCompany.objects.filter(area=area, company=company).update(user=new_user)

            except User.DoesNotExist:
                raise ValidationError("El usuario especificado no existe.")
        else:
            raise ValidationError("Se debe proporcionar un usuario.")

        serializer.save(company=company, user=new_user)

class WorkingAreaDeleteView(generics.DestroyAPIView):
    queryset = Area.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def perform_destroy(self, instance):
        business_manager = self.request.user
        user_company_instance = UserCompany.objects.filter(user=business_manager).first()

        if user_company_instance is None:
            raise ValidationError("No se encontró la compañía asociada con este Business Manager.")

        if instance.company != user_company_instance.company:
            raise PermissionDenied("No tienes permiso para eliminar esta área de trabajo.")

        UserCompany.objects.filter(area=instance, company=user_company_instance.company).update(area=None)

        instance.delete()

class ListCompanyWorkersView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        business_manager = self.request.user

        # Verifica que el usuario logueado sea un Business Manager
        if not business_manager.groups.filter(name="Business Manager").exists():
            raise ValidationError("No tienes permiso para ver esta información.")

        # Obtener la compañía asociada al Business Manager
        user_company_instance = UserCompany.objects.select_related('company').filter(user=business_manager).first()
        if user_company_instance is None:
            raise ValidationError("No se encontró la compañía asociada con este Business Manager.")

        # Obtener todos los UserCompany relacionados con la misma compañía, excluyendo al Business Manager
        user_companies = UserCompany.objects.select_related('area').filter(company=user_company_instance.company).exclude(user=business_manager)

        # Extraer los IDs de usuario
        user_ids = user_companies.values_list('user__id', flat=True)

        # Retornar los usuarios filtrados
        return User.objects.filter(id__in=user_ids)

class ListCompanyWorkersRoleAreaView(generics.ListAPIView):
    serializer_class = UserRoleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        business_manager = self.request.user

        # Verifica que el usuario logueado sea un Business Manager
        if not business_manager.groups.filter(name="Business Manager").exists():
            raise ValidationError("No tienes permiso para ver esta información.")

        # Obtener la compañía asociada al Business Manager
        user_company_instance = UserCompany.objects.filter(user=business_manager).first()
        if user_company_instance is None:
            raise ValidationError("No se encontró la compañía asociada con este Business Manager.")
        
        # Retorna los usuarios que pertenezcan a la misma compañía como instancias de User
        user_ids = UserCompany.objects.filter(company=user_company_instance.company).values_list('user', flat=True)
        return User.objects.filter(id__in=user_ids).exclude(id=business_manager.id)  # Excluye al Business Manager

class RetrieveWorkerView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        business_manager = self.request.user

        # Verifica si el usuario pertenece al grupo "Business Manager"
        if not business_manager.groups.filter(name="Business Manager").exists():
            raise ValidationError("No tienes permiso para ver esta información.")

        user_company_instance = UserCompany.objects.filter(user=business_manager).first()
        if user_company_instance is None:
            raise ValidationError("No se encontró la compañía asociada con este Business Manager.")

        user_ids = UserCompany.objects.filter(company=user_company_instance.company).values_list('user', flat=True)
        return User.objects.filter(id__in=user_ids)

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class UpdateWorkerView(generics.UpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        business_manager = self.request.user

        if not business_manager.groups.filter(name="Business Manager").exists():
            raise ValidationError("No tienes permiso para actualizar esta información.")

        user_company_instance = UserCompany.objects.filter(user=business_manager).first()
        if user_company_instance is None:
            raise ValidationError("No se encontró la compañía asociada con este Business Manager.")

        user_ids = UserCompany.objects.filter(company=user_company_instance.company).values_list('user', flat=True)
        return User.objects.filter(id__in=user_ids)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data

        current_role = instance.groups.values_list('name', flat=True).first()

        if 'role' in data:
            new_worker_id = data.get('new_worker')

            # Verifica si el Area Admin o el Project Manager no están asociados
            if current_role == "Area Admin" and not UserCompany.objects.filter(user=instance).exists():
                # Se permite eliminar sin reemplazo
                pass

            elif current_role == "Project Manager":
                # Se permite eliminar sin reemplazo
                pass
            
            else:
                # Si hay un nuevo trabajador, valida
                if new_worker_id:
                    new_worker = User.objects.get(id=new_worker_id)
                    new_worker_role = new_worker.groups.values_list('name', flat=True).first()
                    if new_worker_role != current_role:
                        raise ValidationError(f"El trabajador que estás intentando asignar no tiene el rol de {current_role}.")
                else:
                    raise ValidationError(f"Debes proporcionar el trabajador que reemplazará al {current_role}.")

        return super().update(request, *args, **kwargs)

class DeleteWorkerView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        business_manager = self.request.user

        if not business_manager.groups.filter(name="Business Manager").exists():
            raise ValidationError("No tienes permiso para eliminar esta información.")

        user_company_instance = UserCompany.objects.filter(user=business_manager).first()
        if user_company_instance is None:
            raise ValidationError("No se encontró la compañía asociada con este Business Manager.")

        user_ids = UserCompany.objects.filter(company=user_company_instance.company).values_list('user', flat=True)
        return User.objects.filter(id__in=user_ids)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data

        current_role = instance.groups.values_list('name', flat=True).first()

        # Verifica si el Area Admin o el Project Manager no están asociados
        if current_role == "Area Admin" and not UserCompany.objects.filter(user=instance).exists():
            # Se permite eliminar sin reemplazo
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        elif current_role == "Project Manager" and not Project.objects.filter(user=instance).exists():
            # Se permite eliminar sin reemplazo
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        # Si el trabajador es asociado, requiere reemplazo
        new_worker_id = data.get('new_worker')
        if not new_worker_id:
            raise ValidationError(f"Debes proporcionar el trabajador que reemplazará al {current_role}.")

        # Validar que el nuevo trabajador sea del mismo rol
        new_worker = User.objects.get(id=new_worker_id)
        new_worker_role = new_worker.groups.values_list('name', flat=True).first()
        if new_worker_role != current_role:
            raise ValidationError(f"El trabajador que estás intentando asignar no tiene el rol de {current_role}.")

        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class ListingAdminAreaAvailableView(generics.ListAPIView):
    serializer_class = UserCompanySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        business_manager = self.request.user
        user_company_instance = UserCompany.objects.filter(user=business_manager).first()
        area_admins = User.objects.filter(groups__name="Area Admin")
        assigned_admins = UserCompany.objects.filter(area__isnull=False).values_list('user_id', flat=True)
        available_admins = area_admins.exclude(id__in=assigned_admins)

        if user_company_instance is None:
            raise ValidationError("No se encontró la compañía asociada con este Business Manager.")

        return UserCompany.objects.filter(user__in=available_admins)

