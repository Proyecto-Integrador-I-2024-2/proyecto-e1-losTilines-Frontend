from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from app.models import User, UserRole, Group
from .serializers import UserSerializer
from rest_framework import serializers
import logging

logger = logging.getLogger(__name__)

class FreelancerRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()  # Guarda el usuario
        # La contraseña ya se maneja en el serializador
        # Asigna el rol de Freelancer
        role, created = Group.objects.get_or_create(name='Freelancer')
        UserRole.objects.create(user=user, role=role)


class BusinessManagerRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()  # Guarda el usuario
        # La contraseña ya se maneja en el serializador
        # Asigna el rol de Business Manager
        role, created = Group.objects.get_or_create(name='Business Manager')
        UserRole.objects.create(user=user, role=role)


class RegisterCompanyUsersView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        role_name = self.request.data.get('role')

        # Validar que sea un rol permitido
        if role_name not in ['Area Admin', 'Project Manager']:
            raise serializers.ValidationError({"error": "Invalid role"})

        # Asegurarse que el que hace la solicitud es un Business Manager
        if not UserRole.objects.filter(user=self.request.user, role__name='Business Manager').exists():
            raise serializers.ValidationError({"error": "Unauthorized"}, code=403)

        # Crea el usuario y asocia el rol
        user = serializer.save()  # Guarda el usuario
        role, created = Group.objects.get_or_create(name=role_name)
        UserRole.objects.create(user=user, role=role)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        logger.debug(f"Request data: {request.data}")
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response(
                {'error': 'Both email and password are needed.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(request, email=email, password=password)
        if user is None:
            return Response(
                {'error': 'The credentials you entered are invalid.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.id,
            'email': user.email
        }, status=status.HTTP_200_OK)