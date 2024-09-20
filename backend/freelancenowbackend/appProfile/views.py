from rest_framework import generics
from app.models import Skill, FreelancerSkill
from rest_framework import serializers
from .serializers import SkillSerializer, FreelancerSkillSerializer
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from appAuth.permission import IsFreelancer

class FreelancerSkillView(generics.ListAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [IsFreelancer]

class FreelancerSkillAddView(generics.CreateAPIView):
    queryset = FreelancerSkill.objects.all()
    serializer_class = FreelancerSkillSerializer
    permission_classes = [IsAuthenticated, IsFreelancer]

    def perform_create(self, serializer):
        user = self.request.user

        skill_name = self.request.data.get('skill')
        level = self.request.data.get('level')

        if not level or int(level) < 0 or int(level) > 100:
            raise serializers.ValidationError({"error": "Skill level must be between 0 and 100"})

        skill, created = Skill.objects.get_or_create(name=skill_name)

        serializer.save(freelancer=user, skill=skill, level=level)