from rest_framework import serializers
from app.models import FreelancerSkill, Experience, Portfolio, Skill, SkillType

class SkillSerializer(serializers.ModelSerializer):
    type = serializers.CharField()  # Acepta el nombre del SkillType

    class Meta:
        model = Skill
        fields = ['id', 'name', 'is_predefined', 'type']

    def create(self, validated_data):
        # Extraer el tipo de habilidad del validated_data
        skill_type_name = validated_data.pop('type')
        
        # Buscar o crear el SkillType basado en el nombre
        skill_type, created = SkillType.objects.get_or_create(name=skill_type_name)
        
        # Crear la Skill utilizando el tipo de habilidad encontrado o creado
        skill = Skill.objects.create(type=skill_type, **validated_data)
        return skill

class FreelancerSkillSerializer(serializers.ModelSerializer):
    skill = serializers.PrimaryKeyRelatedField(queryset=Skill.objects.all(), required=False) 

    class Meta:
        model = FreelancerSkill
        fields = ['id', 'skill', 'level']

    def validate_level(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError("Skill level must be between 0 and 100.")
        return value

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ['id', 'start_date', 'final_date', 'occupation', 'company']

class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ['id', 'date', 'project_name', 'description', 'url']