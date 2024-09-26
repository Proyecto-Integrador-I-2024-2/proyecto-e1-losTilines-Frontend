from rest_framework import generics, status, permissions, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.decorators import action
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from app.models import User, UserRole, Group, Company, UserCompany, Freelancer
from .serializers import UserSerializer, CompanySerializer
from rest_framework import serializers
import logging
from rest_framework.exceptions import PermissionDenied, ValidationError

logger = logging.getLogger(__name__)

class RegisterView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'], url_path='freelancer')
    def freelancer(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        role, created = Group.objects.get_or_create(name='Freelancer')
        user.groups.add(role)
        UserRole.objects.create(user=user, role=role)
        Freelancer.objects.create(user=user)
        
        return Response(self.get_serializer(user).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], url_path='business-manager')
    def business_manager(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        role, created = Group.objects.get_or_create(name='Business Manager')
        user.groups.add(role)
        UserRole.objects.create(user=user, role=role)
        
        return Response(self.get_serializer(user).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], url_path='admin-area')
    def admin_area(self, request):
        businessmanager = request.user
        user_company_instance = UserCompany.objects.filter(user=businessmanager).first()

        if user_company_instance is None:
            return Response(
                {"error": "No se encontró la compañía asociada con este Business Manager."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not businessmanager.groups.filter(name='Business Manager').exists():
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        area_admin_user = serializer.save()
        
        role, created = Group.objects.get_or_create(name='Area Admin')
        UserRole.objects.create(user=area_admin_user, role=role)
        area_admin_user.groups.add(role)

        UserCompany.objects.create(company=user_company_instance.company, user=area_admin_user)

        return Response(self.get_serializer(area_admin_user).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], url_path='project-manager')
    def project_manager(self, request):
        businessmanager = request.user
        user_company_instance = UserCompany.objects.filter(user=businessmanager).first()

        if user_company_instance is None:
            return Response(
                {"error": "No se encontró la compañía asociada con este Business Manager."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not businessmanager.groups.filter(name='Business Manager').exists():
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        project_manager_user = serializer.save()
        
        role, created = Group.objects.get_or_create(name='Project Manager')
        UserRole.objects.create(user=project_manager_user, role=role)
        project_manager_user.groups.add(role)

        UserCompany.objects.create(company=user_company_instance.company, user=project_manager_user)

        return Response(self.get_serializer(project_manager_user).data, status=status.HTTP_201_CREATED)




class CreateCompanyView(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]


    def perform_create(self, serializer):
        user = self.request.user

        if not user.groups.filter(name='Business Manager').exists():
            raise PermissionDenied("You must be a Business Manager to create a company.")
            
        serializer.save(user=user)

        company = serializer.save()

        UserCompany.objects.create(company=company, user=user)



class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
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
    
