from rest_framework import serializers
from app.models import Freelancer, ProjectFreelancer, Project
from app.serializers import FreelancerSkillSerializer, ExperienceSerializer, ProjectSerializer, UserSerializer

class FreelancerDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer()  
    skills = FreelancerSkillSerializer(many=True) 
    experience_set = ExperienceSerializer(many=True) 
    projects = serializers.SerializerMethodField() 

    class Meta:
        model = Freelancer
        fields = ['user', 'description', 'country', 'city', 'portfolio', 'skills', 'experience_set', 'projects']

    def get_projects(self, obj):
        # Obtener proyectos únicos asociados al freelancer (tanto de milestones como de ProjectFreelancer)
        project_freelancers = ProjectFreelancer.objects.filter(freelancer=obj).values_list('project', flat=True)
        
        projects = Project.objects.filter(id__in=project_freelancers)
        return ProjectSerializer(projects, many=True).data