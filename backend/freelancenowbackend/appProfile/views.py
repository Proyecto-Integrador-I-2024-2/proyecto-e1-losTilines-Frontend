from django.forms import ValidationError
from rest_framework import generics
from app.models import Skill, FreelancerSkill, SkillType
from rest_framework import serializers
from .serializers import SkillSerializer, FreelancerSkillSerializer
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from appAuth.permission import IsFreelancer

class FreelancerSkillView(generics.ListAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated, IsFreelancer]

class SkillCreateView(generics.CreateAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated, IsFreelancer]

    def perform_create(self, serializer):
        skill_name = self.request.data.get('name')
        is_predefined = self.request.data.get('is_predefined', False)
        skill_type_name = self.request.data.get('type')

        skill_type, created = SkillType.objects.get_or_create(name=skill_type_name)
        
        if Skill.objects.filter(name=skill_name).exists():
            raise ValidationError({"error": f"Skill with name '{skill_name}' already exists."})

        serializer.save(name=skill_name, is_predefined=is_predefined, type=skill_type)

class FreelancerSkillAddView(generics.CreateAPIView):
    queryset = FreelancerSkill.objects.all()
    serializer_class = FreelancerSkillSerializer
    permission_classes = [IsAuthenticated, IsFreelancer]

    def perform_create(self, serializer):
        user = self.request.user

        skill_name = self.request.data.get('skill')
        level = self.request.data.get('level')

        if level is None or int(level) < 0 or int(level) > 100:
            raise ValidationError({"error": "Skill level must be between 0 and 100"})

        try:
            skill = Skill.objects.get(name=skill_name)
        except Skill.DoesNotExist:
            raise ValidationError({"error": f"Skill with name '{skill_name}' does not exist."})

        if FreelancerSkill.objects.filter(freelancer=user, skill=skill).exists():
            raise ValidationError({"error": f"You already have the skill '{skill_name}'."})

        serializer.save(freelancer=user, skill=skill, level=level)