from rest_framework import serializers
from app.models import FreelancerSkill, Experience, Portfolio, Skill

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'is_predefined']

class FreelancerSkillSerializer(serializers.ModelSerializer):
    skill = serializers.CharField()  # Usa CharField para recibir el nombre de la habilidad como cadena

    class Meta:
        model = FreelancerSkill
        fields = ['id', 'skill', 'level']

    def validate_skill(self, value):
        # Convierte el nombre de habilidad en un objeto Skill
        if isinstance(value, str):
            skill, created = Skill.objects.get_or_create(name=value)
            return skill
        return value

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ['id', 'start_date', 'final_date', 'occupation', 'company']

class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ['id', 'date', 'project_name', 'description', 'url']