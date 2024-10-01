from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from app.models import Skill, FreelancerSkill, Experience, Portfolio, SkillType
from .serializers import SkillSerializer, FreelancerSkillSerializer, ExperienceSerializer, PortfolioSerializer
from appAuth.permission import IsFreelancer
from rest_framework.exceptions import ValidationError
from django_filters.rest_framework import DjangoFilterBackend
from .filters import *


class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_class = SkillFilter

    def perform_create(self, serializer):
        skill_name = self.request.data.get('name')
        is_predefined = self.request.data.get('is_predefined', False)
        skill_type_name = self.request.data.get('type')

        skill_type, _ = SkillType.objects.get_or_create(name=skill_type_name)

        if Skill.objects.filter(name=skill_name).exists():
            raise ValidationError({"error": f"Skill with name '{skill_name}' already exists."})

        serializer.save(name=skill_name, is_predefined=is_predefined, type=skill_type)

# Freelancer Experience ViewSet
class ExperienceViewSet(viewsets.ModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_class = ExperienceFilter

    def perform_create(self, serializer):
         serializer.save(freelancer=self.request.user)

# Freelancer Portfolio ViewSet
class PortfolioViewSet(viewsets.ModelViewSet):
    queryset = Portfolio.objects.all()
    serializer_class = PortfolioSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = PortfolioFilter

    def get_queryset(self):
         # Only allow freelancers to access their own portfolios
         return Portfolio.objects.filter(freelancer=self.request.user)

    def perform_create(self, serializer):
         serializer.save(freelancer=self.request.user)



