from rest_framework import serializers
from app.models import Company, Project, Area, ProjectSkill, Freelancer
from app.serializers import UserSerializer, CompanySerializer, ProjectSerializer
from django.db.models import Count, Avg

class FreelancerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Freelancer
        fields = ['user', 'description', 'portfolio']

    user = serializers.SerializerMethodField()

    def get_user(self, obj):
        return {
            'name': f"{obj.user.first_name} {obj.user.last_name}",
            'img': obj.user.profile_picture
        }
    
class CompanySkillSerializer(serializers.Serializer):
    skill_id = serializers.IntegerField(source='skill__id')
    skill_name = serializers.CharField(source='skill__name')
    project_count = serializers.IntegerField()
    average_level = serializers.FloatField()

class CompanyDetailSerializer(serializers.ModelSerializer):
    freelancers = serializers.SerializerMethodField()
    projects = serializers.SerializerMethodField()
    skills = serializers.SerializerMethodField() 

    class Meta:
        model = Company
        fields = ['id', 'name', 'tax_id', 'email', 'description', 'industry', 'freelancers', 'projects', 'skills']

    def get_freelancers(self, obj):
        projects_in_company = Project.objects.filter(user__usercompany__company=obj)
        
        freelancers = Freelancer.objects.filter(
            projectfreelancer__project__in=projects_in_company
        ).distinct()
        
        return FreelancerSerializer(freelancers, many=True).data

    def get_projects(self, obj):
        projects = Project.objects.filter(user__usercompany__company=obj)
        return ProjectSerializer(projects, many=True).data
    
    def get_skills(self, obj):
        projects_in_company = Project.objects.filter(user__usercompany__company=obj)
        
        skills_with_stats = ProjectSkill.objects.filter(
            project__in=projects_in_company
        ).values('skill__id', 'skill__name').annotate(
            project_count=Count('project', distinct=True),
            average_level=Avg('level')
        ).order_by('-project_count')

        return CompanySkillSerializer(skills_with_stats, many=True).data
        
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
        user_role = getattr(obj.userrole_set.first(), 'role', None)
        if user_role:
            return user_role.name
        return None

    def get_company(self, obj):
        user_company = obj.usercompany_set.first()
        if user_company:
            return user_company.company.id
        return None

    def get_area(self, obj):
        user_company = obj.usercompany_set.first()
        if user_company and user_company.area:
            return user_company.area.id
        return None

    def get_related_projects(self, obj):
        user_role = obj.userrole_set.first()
        if not user_role:
            return []

        role_name = user_role.role.name

        if role_name == 'Business Manager':
            companies = Company.objects.filter(user=obj)
            projects = Project.objects.filter(
                user__usercompany__company__in=companies
            ).distinct()

        elif role_name == 'Area Admin':
            user_company = obj.usercompany_set.select_related('company', 'area').first()
            if user_company and user_company.area:
                projects = Project.objects.filter(
                    user__usercompany__company=user_company.company, 
                    user__usercompany__area=user_company.area
                ).distinct().union(Project.objects.filter(user=obj).distinct())
            else:
                projects = Project.objects.filter(user=obj).distinct()

        elif role_name == 'Project Manager':
            projects = Project.objects.filter(user=obj).distinct()

        else:
            projects = Project.objects.none()

        return RelatedProjectSerializer(projects, many=True).data
