from rest_framework import generics, status, permissions
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from app.models import User, UserRole, Group, Company
from .serializers import UserSerializer, CompanySerializer
from rest_framework import serializers
import logging
from rest_framework.exceptions import PermissionDenied

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
        user.groups.add(role)


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
        user.groups.add(role)




class CreateCompanyView(generics.CreateAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user

        # Verificar si el usuario tiene el rol de 'Business Manager'
        if not user.groups.filter(name='Business Manager').exists():
            raise PermissionDenied("You must be a Business Manager to create a company.")
            

        # Si pasa la verificación, guarda la compañía con el usuario autenticado
        serializer.save(user=user)



class RegisterAreaAdminView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        # Asegurarse que el que hace la solicitud es un Business Manager
        if not user.groups.filter(name='Business Manager').exists():
            raise serializers.ValidationError({"error": "Unauthorized"}, code=403)
        # Crea el usuario y asocia el rol "Area Admin"
        user = serializer.save()  # Guarda el usuario
        role, created = Group.objects.get_or_create(name='Area Admin')
        UserRole.objects.create(user=user, role=role)
        user.groups.add(role)

class RegisterProjectManagerView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        # Asegurarse que el que hace la solicitud es un Business Manager
        if not user.groups.filter(name='Business Manager').exists():
            raise serializers.ValidationError({"error": "Unauthorized"}, code=403)
        # Crea el usuario y asocia el rol "Area Admin"
        user = serializer.save()  # Guarda el usuario
        role, created = Group.objects.get_or_create(name='Project Manager')
        UserRole.objects.create(user=user, role=role)
        user.groups.add(role)




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