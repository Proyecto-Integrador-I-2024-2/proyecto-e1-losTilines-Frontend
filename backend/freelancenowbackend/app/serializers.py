from rest_framework import serializers
from django.contrib.auth.models import Group
from .models import User, UserRole, Notification, UserNotification, Company, Area, UserCompany, Freelancer, Project, ProjectStatus

# ---------------------- USERS ---------------------- #
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'phone_number', 'created_at', 'profile_picture', 'is_active', 'is_staff']

class UserRoleSerializer(serializers.ModelSerializer):
    role_name = serializers.CharField(source='role.name')

    class Meta:
        model = UserRole
        fields = ['role_name', 'user']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'message', 'created_at']

class UserNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserNotification
        fields = ['id', 'notification', 'user']

# ---------------------- COMPANIES ---------------------- #
class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'tax_id', 'name', 'country', 'city', 'address', 'telephone', 'email', 'user', 'description', 'industry']

class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = ['id', 'name', 'company', 'user']

class UserCompanySerializer(serializers.ModelSerializer):
    company = CompanySerializer()
    area = AreaSerializer()

    class Meta:
        model = UserCompany
        fields = ['id', 'company', 'user', 'area']

# ---------------------- FREELANCERS ---------------------- #
class FreelancerSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Freelancer
        fields = ['user', 'description', 'country', 'city']

# ---------------------- PROJECTS ---------------------- #
class ProjectStatusSerializer(serializers.ModelSerializer):
    class Meta: 
        model = ProjectStatus
        field = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    status = ProjectStatusSerializer()  

    class Meta: 
        model = Project
        fields = '__all__'