from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer, CompanySerializer, SupportRequestSerializer
from app.models import User, Group, UserRole, Freelancer, Company
from rest_framework.response import Response
from django.contrib.auth import authenticate
from app.models import User, UserRole, Group, UserCompany, Freelancer
from app.permission import IsBusinessManager, IsBusinessManagerOrReadOnly, IsOwnerOrReadOnly
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from .filters import FreelancerFilter, WorkerFilter, CompanyFilter
from app.serializers import UserRoleSerializer
from django.core.mail import send_mail
from django.conf import settings

class UserRoleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = UserRole.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserRoleSerializer

class BaseUserFreeViewSet(viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend]

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        elif self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        elif self.action in ['update', 'partial_update']:
            return [IsAuthenticated(), IsOwnerOrReadOnly()]
        return super().get_permissions()

    def perform_create(self, serializer, group_name):
        user = serializer.save()
        role, created = Group.objects.get_or_create(name=group_name)
        user.groups.add(role)
        UserRole.objects.create(user=user, role=role)

class FreelancerViewSet(BaseUserFreeViewSet):
    queryset = User.objects.filter(groups__name='Freelancer')
    serializer_class = UserSerializer
    filterset_class = FreelancerFilter

    def perform_create(self, serializer):
        super().perform_create(serializer, 'Freelancer')
        Freelancer.objects.create(user=serializer.save())

class BusinessManagerViewSet(BaseUserFreeViewSet):
    queryset = User.objects.filter(groups__name='Business Manager')
    serializer_class = UserSerializer
    filterset_class = WorkerFilter

    def perform_create(self, serializer):
        super().perform_create(serializer, 'Business Manager')

class BaseUserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsBusinessManager]
    filter_backends = [DjangoFilterBackend]
    filterset_class = WorkerFilter

    def get_queryset(self):
        # Filtrar usuarios de la misma compañía
        business_manager = self.request.user
        user_company_instance = UserCompany.objects.filter(user=business_manager).first()
        return self.queryset.filter(usercompany__company=user_company_instance.company)

    def perform_create(self, serializer, role_name):
        business_manager = self.request.user
        user_company_instance = UserCompany.objects.filter(user=business_manager).first()

        user = serializer.save()
        role, created = Group.objects.get_or_create(name=role_name)
        user.groups.add(role)
        UserRole.objects.create(user=user, role=role)
        UserCompany.objects.create(company=user_company_instance.company, user=user)

    def update(self, request, *args, **kwargs):
        raise PermissionDenied("Updating worker is not allowed.")

    def destroy(self, request, *args, **kwargs):
        raise PermissionDenied("Deleting worker is not allowed.")

class ProjectManagerViewSet(BaseUserViewSet):
    queryset = User.objects.filter(groups__name='Project Manager')
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        super().perform_create(serializer, 'Project Manager')

class AdminAreaViewSet(BaseUserViewSet):
    queryset = User.objects.filter(groups__name='Area Admin')
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        super().perform_create(serializer, 'Area Admin')

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated, IsBusinessManagerOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_class = CompanyFilter

    def get_queryset(self):
        user = self.request.user
        if user.groups.filter(name='Business Manager').exists():
            return Company.objects.filter(usercompany__user=user)
        return Company.objects.none()

    def perform_create(self, serializer):
        company = serializer.save()
        UserCompany.objects.create(user=self.request.user, company=company)

    def perform_update(self, serializer):
        user_company_instance = UserCompany.objects.filter(user=self.request.user).first()
        if not user_company_instance:
            raise ValidationError({"error": "You are not associated with any company."})
        
        serializer.save(company=user_company_instance.company)

#--------------------------------------------------------------------------------------------------#
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
        
        user_roles = UserRole.objects.filter(user = user).select_related('role')
        roles = [user_role.role.name for user_role in user_roles]
        return Response({
            'token': token.key,
            'user_id': user.id,
            'email': user.email,
            'roles': roles
        }, status=status.HTTP_200_OK)
    
# -----------------------------------------------------------------------------------------------------------------#
class SupportViewSet(viewsets.ViewSet):
    def create(self, request):
        # Validar los datos de entrada
        serializer = SupportRequestSerializer(data=request.data)
        if serializer.is_valid():
            subject = serializer.validated_data['subject']
            message = serializer.validated_data['message']
            user_email = serializer.validated_data['user_email']
            request_type = serializer.validated_data['request_type']

            # Construir el contenido del correo
            email_subject = f"New support: {subject} - {request_type.capitalize()}"
            email_message = f"Request type: {request_type.capitalize()}\n\Message:\n{message}\n\nFrom: {user_email}"

            try:
                # Enviar el correo (esto usa la configuración de correo en settings.py)
                send_mail(
                    email_subject,
                    email_message,
                    settings.DEFAULT_FROM_EMAIL,
                    [settings.SUPPORT_EMAIL], 
                )
                return Response({"message": "Your request has been sent successfully."}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
