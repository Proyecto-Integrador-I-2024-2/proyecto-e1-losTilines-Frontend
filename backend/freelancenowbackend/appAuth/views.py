from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer, CompanySerializer
from app.models import User, Group, UserRole, Freelancer, Company
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.decorators import action
from app.models import User, UserRole, Group, UserCompany, Freelancer
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView


#Creacion de usuarios

class FreelancerViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(groups__name='Freelancer')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = serializer.save()
        role, created = Group.objects.get_or_create(name='Freelancer')
        user.groups.add(role)
        UserRole.objects.create(user=user, role=role)
        Freelancer.objects.create(user=user)


class BusinessManagerViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(groups__name='Business Manager')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = serializer.save()
        role, created = Group.objects.get_or_create(name='Business Manager')
        user.groups.add(role)
        UserRole.objects.create(user=user, role=role)


class ProjectManagerViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(groups__name='Project Manager')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        businessmanager = self.request.user
        user_company_instance = UserCompany.objects.filter(user=businessmanager).first()

        if not businessmanager.groups.filter(name='Business Manager').exists():
            raise PermissionDenied("Unauthorized")

        user = serializer.save()
        role, created = Group.objects.get_or_create(name='Project Manager')
        user.groups.add(role)
        UserRole.objects.create(user=user, role=role)
        UserCompany.objects.create(company=user_company_instance.company, user=user)


class AdminAreaViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(groups__name='Area Admin')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        businessmanager = self.request.user
        user_company_instance = UserCompany.objects.filter(user=businessmanager).first()

        if not businessmanager.groups.filter(name='Business Manager').exists():
            raise PermissionDenied("Unauthorized")

        user = serializer.save()
        role, created = Group.objects.get_or_create(name='Area Admin')
        user.groups.add(role)
        UserRole.objects.create(user=user, role=role)
        UserCompany.objects.create(company=user_company_instance.company, user=user)


# Company ViewSet
class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Solo las compañías pueden ser vistas o editadas por los Business Managers
        if self.action in ['retrieve', 'update']:
            user = self.request.user
            if not user.groups.filter(name='Business Manager').exists():
                raise PermissionDenied({"error": "You are not authorized to access this company information."})
            return Company.objects.filter(usercompany__user=user)
        return super().get_queryset()

    def perform_update(self, serializer):
        # Solo los Business Managers pueden actualizar la información de la compañía
        user_company_instance = UserCompany.objects.filter(user=self.request.user).first()
        if not user_company_instance:
            raise ValidationError("No company associated with this Business Manager.")
        serializer.save(company=user_company_instance.company)


#--------------------------------------------------------------------------------------------------#

#Login and logout

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
    

