from rest_framework import serializers
from django.contrib.auth.models import Group
from .models import *

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
        fields = ['id', 'name']

class ProjectSerializer(serializers.ModelSerializer):
    status = ProjectStatusSerializer()  

    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'start_date', 'budget', 'status']

# ---------------Freelancer skills-----------------------#
class SkillSerializer(serializers.ModelSerializer):
    type = serializers.CharField()

    class Meta:
        model = Skill
        fields = ['id', 'name', 'is_predefined', 'type']

    def create(self, validated_data):
        skill_type_name = validated_data.pop('type')
        
        skill_type, created = SkillType.objects.get_or_create(name=skill_type_name)
        
        skill = Skill.objects.create(type=skill_type, **validated_data)
        return skill

class FreelancerSkillSerializer(serializers.ModelSerializer):
    skill = serializers.PrimaryKeyRelatedField(queryset=Skill.objects.all(), required=False) 

    class Meta:
        model = FreelancerSkill
        fields = ['id', 'freelancer', 'skill', 'level' ]

    def validate_level(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError("Skill level must be between 0 and 100.")
        return value

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ['id', 'start_date', 'final_date', 'occupation', 'company', 'description', 'freelancer']

    def create(self, validated_data):
        validated_data['freelancer'] = self.context['request'].user
        return super().create(validated_data)
    
    def validate(self, attrs):
        start_date = attrs.get('start_date')
        final_date = attrs.get('final_date')

        if final_date and start_date and final_date < start_date:
            raise serializers.ValidationError("La fecha final no puede ser anterior a la fecha de inicio.")
        
        return attrs

