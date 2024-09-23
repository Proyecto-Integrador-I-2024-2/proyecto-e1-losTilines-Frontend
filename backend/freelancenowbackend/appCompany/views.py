from rest_framework import generics, permissions
from app.models import Area, User, Company, UserCompany
from .serializers import AreaSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied, ValidationError

class WorkingAreaCreationView(generics.CreateAPIView):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        business_manager = self.request.user
        print(business_manager)

    # Obtener la primera instancia de UserCompany para el Business Manager
        user_company_instance = UserCompany.objects.filter(user=business_manager).first()
    
        if user_company_instance is None:
            raise ValidationError("No se encontró la compañía asociada con este Business Manager.")

    # Imprimir la compañía
        print(user_company_instance.company)

    # Verificar si el usuario pertenece al grupo "Business Manager"
        if not business_manager.groups.filter(name='Business Manager').exists():
            raise PermissionDenied("No tienes permiso para crear un área de trabajo.")

    # Obtener la compañía
        company = user_company_instance.company
    
    # Asegurarse de que el 'user' que se va a asignar pertenece al grupo "Admin Area"
        user_id = self.request.data.get("user")
        print(user_id)
        user = User.objects.get(id=user_id)
        print(user)
        if user_id:
            try:
                user = User.objects.get(id=user_id)
                if not user.groups.filter(name='Area Admin').exists():
                    print(user.groups)
                    raise ValidationError("El usuario debe pertenecer al grupo 'Admin Area'.")
            except User.DoesNotExist:
                raise ValidationError("El usuario especificado no existe.")
        else:
            raise ValidationError("Se debe proporcionar un usuario.")

    # Crear el área de trabajo con la compañía y el usuario especificado
        serializer.save(company=company, user=user)
