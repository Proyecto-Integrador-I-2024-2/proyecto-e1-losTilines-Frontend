from rest_framework import serializers
from app.models import Project, ProjectFreelancer, Milestone
from django.core.exceptions import ValidationError
from app.serializers import FreelancerSerializer

# Serializador para los freelancers asociados a un proyecto
class ProjectFreelancerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectFreelancer
        fields = '__all__'

# Serializador principal del proyecto
class ProjectSerializer(serializers.ModelSerializer):
    freelancers = ProjectFreelancerSerializer(source='projectfreelancer_set', many=True, read_only=True)
    company = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ['user', 'company', 'freelancers', 'status']  # Se definen como de solo lectura

    # Validación general del presupuesto y otras reglas del proyecto
    def validate(self, data):
        if 'budget' in data and data['budget'] < 0:
            raise serializers.ValidationError("Budget must be a positive value.")
        return data
    

class MilestoneSerializer(serializers.ModelSerializer):
    freelancer = FreelancerSerializer(read_only=True)  # Rellenar automáticamente con el usuario actual
    project = ProjectSerializer(read_only=True)  # Lo llenaremos en el viewset

    class Meta:
        model = Milestone
        fields = '__all__'
        read_only_fields = ['freelancer', 'project', 'due_date']

    # Validar el presupuesto u otras reglas de milestone si es necesario
    def validate(self, data):
        # Puedes agregar más validaciones aquí si lo necesitas
        return data