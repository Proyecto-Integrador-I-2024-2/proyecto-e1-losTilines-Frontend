from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from app.models import User, Role, UserRole
from .serializers import UserSerializer

class FreelancerRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()  # Guarda el usuario
        user.set_password(user.password)  # Aplica el hash a la contraseña
        user.save()  # Guarda el usuario nuevamente con la contraseña encriptada
        
        # Asigna el rol de Freelancer
        role, created = Role.objects.get_or_create(name='Freelancer')
        UserRole.objects.create(user=user, role=role)

class BusinessManagerRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()  # Guarda el usuario
        user.set_password(user.password)  # Aplica el hash a la contraseña
        user.save()  # Guarda el usuario nuevamente con la contraseña encriptada
        
        # Asigna el rol de Business Manager
        role, created = Role.objects.get_or_create(name='Business Manager')
        UserRole.objects.create(user=user, role=role)

class RegisterCompanyUsersView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        role_name = self.request.data.get('role')

        # Validar que sea un rol permitido
        if role_name not in ['Area Admin', 'Project Manager']:
            return Response({"error": "Invalid role"}, status=status.HTTP_400_BAD_REQUEST)

        # Asegurarse que el que hace la solicitud es un Business Manager
        if not UserRole.objects.filter(user=self.request.user, role__name='Business Manager').exists():
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        # Crea el usuario y asocia el rol
        user = serializer.save()  # Guarda el usuario
        user.set_password(user.password)  # Aplica el hash a la contraseña
        user.save()  # Guarda el usuario nuevamente con la contraseña encriptada

        role, created = Role.objects.get_or_create(name=role_name)
        UserRole.objects.create(user=user, role=role)

import logging

logger = logging.getLogger(__name__)

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        logger.info(f"Request data: {request.data}")
        print(f"Request data: {request.data}")
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({"non_field_errors": ["Both username and password are required."]}, status=400)

        user = authenticate(username=username, password=password)

        if user is None:
            return Response({"non_field_errors": ["Unable to log in with provided credentials."]}, status=400)

        token, created = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "user_id": user.id, "email": user.email})
