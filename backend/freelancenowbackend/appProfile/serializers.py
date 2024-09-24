from rest_framework import serializers
from app.models import FreelancerSkill, Experience, Portfolio, Skill, SkillType

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
        fields = ['id', 'skill', 'level' ]

    def validate_level(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError("Skill level must be between 0 and 100.")
        return value

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ['id', 'start_date', 'final_date', 'occupation', 'company', 'description']

    def create(self, validated_data):
        validated_data['freelancer'] = self.context['request'].user
        return super().create(validated_data)
    
    def validate(self, attrs):
        if attrs['final_date'] and attrs['final_date'] < attrs['start_date']:
            raise serializers.ValidationError("Final date cannot be before start date.")
        return attrs
    
class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ['id', 'date', 'project_name', 'description', 'url']

    def create(self, validated_data):
        validated_data['freelancer'] = self.context['request'].user
        return super().create(validated_data)

    def validate_freelancer(self, value):
        if not value.groups.filter(name="Freelancer").exists():
            raise serializers.ValidationError("The user must be part of the 'freelancer' group.")
        return value