from rest_framework import serializers
from app.models import Project, ProjectFreelancer
from django.core.exceptions import ValidationError

# Serializador para los freelancers asociados a un proyecto
class ProjectFreelancerSerializer(serializers.ModelSerializer):
    freelancer = serializers.StringRelatedField()

    class Meta:
        model = ProjectFreelancer
        fields = ['freelancer']

# Serializador principal del proyecto
class ProjectSerializer(serializers.ModelSerializer):
    freelancers = ProjectFreelancerSerializer(source='projectfreelancer_set', many=True, read_only=True)
    company = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'start_date', 'budget', 'area', 'file', 'status', 'company', 'profile_picture', 'freelancers']
        read_only_fields = ['user', 'company', 'freelancers', 'status']  # Se definen como de solo lectura

    # Validación general del presupuesto y otras reglas del proyecto
    def validate(self, data):
        if 'budget' in data and data['budget'] < 0:
            raise serializers.ValidationError("Budget must be a positive value.")
        return data