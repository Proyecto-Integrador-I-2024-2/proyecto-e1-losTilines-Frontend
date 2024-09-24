from rest_framework import generics, permissions
from app.models import Area, User, UserCompany
from .serializers import AreaSerializer
from rest_framework.exceptions import PermissionDenied, ValidationError

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
