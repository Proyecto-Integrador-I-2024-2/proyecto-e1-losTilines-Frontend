from rest_framework import serializers
from django.contrib.auth.models import Group
from .models import *

# ---------------------- USERS ---------------------- #
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'phone_number', 'created_at', 'profile_picture', 'is_active', 'is_staff']

class UserRoleSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    role_name = serializers.CharField(source='role.name')

    class Meta:
        model = UserRole
        fields = ['role_name', 'user']

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
class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'start_date', 'budget', 'status']

# ---------------Freelancer skills-----------------------#
class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'is_predefined']

class FreelancerSkillSerializer(serializers.ModelSerializer):
    skill = serializers.PrimaryKeyRelatedField(queryset=Skill.objects.all(), required=False) 
    skill_name = serializers.CharField(source='skill.name', read_only=True)

    class Meta:
        model = FreelancerSkill
        fields = ['id', 'freelancer', 'skill_name', 'skill', 'level' ]

    def validate_level(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError("Skill level must be between 0 and 100.")
        return value
    
    def create(self, validated_data):
        user = self.context['request'].user
        freelancer = Freelancer.objects.get(user=user)
        validated_data['freelancer'] = freelancer
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data.pop('freelancer', None)
        return super().update(instance, validated_data)

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ['id', 'start_date', 'final_date', 'occupation', 'company', 'description', 'freelancer']

    def create(self, validated_data):
        user = self.context['request'].user
        freelancer = Freelancer.objects.get(user=user)
        validated_data['freelancer'] = freelancer
        return super().create(validated_data)

    def validate(self, attrs):
        start_date = attrs.get('start_date')
        final_date = attrs.get('final_date')

        if final_date and start_date and final_date < start_date:
            raise serializers.ValidationError("La fecha final no puede ser anterior a la fecha de inicio.")
        
        return attrs

class ProjectSkillSerializer(serializers.ModelSerializer):
    skill = SkillSerializer()

    class Meta:
        model = ProjectSkill
        fields = ['id', 'project', 'skill', 'level']