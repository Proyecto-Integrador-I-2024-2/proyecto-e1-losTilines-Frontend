from rest_framework import serializers
from app.models import Project, ProjectFreelancer, Milestone, Status, ProjectSkill, Deliverable
from django.core.exceptions import ValidationError
from app.serializers import FreelancerSerializer, UserSerializer, StatusSerializer, ProjectSkillSerializer

# Serializador para los freelancers asociados a un proyecto
class ProjectFreelancerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectFreelancer
        fields = '__all__'

# Serializador principal del proyecto
class ProjectSerializer(serializers.ModelSerializer):
    freelancers = ProjectFreelancerSerializer(source='projectfreelancer_set', many=True, read_only=True)
    company = serializers.StringRelatedField(read_only=True)
    user = UserSerializer(read_only=True)  # Rellenar automáticamente con el usuario actual
    status = serializers.PrimaryKeyRelatedField(queryset=Status.objects.all())
    status_name = serializers.CharField(source='status.name', read_only=True)
    skills = serializers.SerializerMethodField() 
    
    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ['user', 'company', 'freelancers', 'status', 'skills']  # Se definen como de solo lectura

    def get_skills(self, obj):
        skills = ProjectSkill.objects.filter(project=obj)
        return ProjectSkillSerializer(skills, many=True).data

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
        read_only_fields = ['freelancer', 'project']

    due_date = serializers.DateField(required=True) 

    # Validar el presupuesto u otras reglas de milestone si es necesario
    def validate(self, data):
        # Puedes agregar más validaciones aquí si lo necesitas
        return data
    
class DeliverableSerializer(serializers.ModelSerializer):
    milestone = MilestoneSerializer(read_only=True)  # Rellenar automáticamente con el milestone actual

    class Meta:
        model = Deliverable
        fields = '__all__'
        read_only_fields = ['name', 'description', 'milestone']
    
    # Validar el presupuesto u otras reglas de milestone si es necesario
    def validate(self, data):
        # Puedes agregar más validaciones aquí si lo necesitas
        return data