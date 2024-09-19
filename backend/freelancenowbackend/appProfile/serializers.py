from rest_framework import serializers
from app.models import FreelancerSkill, Experience, Portfolio, Skill

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'is_predefined']

class FreelancerSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = FreelancerSkill
        fields = ['id', 'freelancer','skill', 'level']

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ['id', 'start_date', 'final_date', 'occupation', 'company']

class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ['id', 'date', 'project_name', 'description', 'url']