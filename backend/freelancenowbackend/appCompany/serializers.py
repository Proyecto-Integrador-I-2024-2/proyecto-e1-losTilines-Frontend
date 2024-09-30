from rest_framework import serializers
from app.models import UserRole, Company, UserCompany, Project
from app.serializers import (
    UserSerializer, CompanySerializer, AreaSerializer
)

class RelatedProjectSerializer(serializers.ModelSerializer):
    project_manager = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ['id', 'name', 'status', 'project_manager']

    def get_project_manager(self, obj):
        if obj.user:
            return f"{obj.user.first_name} {obj.user.last_name}"
        return None

class WorkerSerializer(UserSerializer):
    role = serializers.SerializerMethodField()
    company = serializers.SerializerMethodField() 
    area = serializers.SerializerMethodField() 
    related_projects = serializers.SerializerMethodField()

    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + ['role', 'company', 'area', 'related_projects']

    def get_role(self, obj):
        user_role = UserRole.objects.filter(user=obj).first()
        if user_role:
            return user_role.role.name
        return None
    
    def get_company(self, obj):
        user_company = UserCompany.objects.filter(user=obj).first()
        if user_company:
            return user_company.company.id
        return None

    def get_area(self, obj):
        user_company = UserCompany.objects.filter(user=obj).first()
        if user_company:
            return user_company.area.id
        return None

    def get_related_projects(self, obj):
        user_role = UserRole.objects.filter(user=obj).first()
        if not user_role:
            return []

        role_name = user_role.role.name

        if role_name == 'Business Manager':
            companies = Company.objects.filter(user=obj)
            projects = Project.objects.filter(
                user__usercompany__company__in=companies
            ).distinct()

        elif role_name == 'Area Admin':
            user_company = UserCompany.objects.filter(user=obj).select_related('company', 'area').first()
            if user_company and user_company.area:
                projects = Project.objects.filter(
                    user__usercompany__company=user_company.company,
                    user__usercompany__area=user_company.area
                ).distinct()
            else:
                projects = Project.objects.none()

        elif role_name == 'Project Manager':
            projects = Project.objects.filter(user=obj).distinct()

        else:
            projects = Project.objects.none()

        return RelatedProjectSerializer(projects, many=True).data
