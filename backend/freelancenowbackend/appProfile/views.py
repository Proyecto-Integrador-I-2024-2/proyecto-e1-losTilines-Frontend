from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from app.models import Skill, FreelancerSkill, Experience, Portfolio, SkillType
from .serializers import SkillSerializer, FreelancerSkillSerializer, ExperienceSerializer, PortfolioSerializer
from appAuth.permission import IsFreelancer
from rest_framework.exceptions import ValidationError

# Freelancer Skill ViewSet
class FreelancerSkillViewSet(viewsets.ModelViewSet):
    queryset = FreelancerSkill.objects.all()
    serializer_class = FreelancerSkillSerializer
    permission_classes = [IsAuthenticated, IsFreelancer]

    def get_queryset(self):
        # Freelancer can only access their own skills
        if self.action in ['list', 'retrieve']:
            return FreelancerSkill.objects.filter(freelancer=self.request.user).select_related('skill')
        return super().get_queryset()

    def perform_create(self, serializer):
        user = self.request.user
        skill_id = self.kwargs.get('skill_id')
        level = self.request.data.get('level')

        # Validate level
        if level is None or int(level) < 0 or int(level) > 100:
            raise ValidationError({"error": "Skill level must be between 0 and 100"})

        # Validate skill existence
        try:
            skill = Skill.objects.get(id=skill_id)
        except Skill.DoesNotExist:
            raise ValidationError({"error": f"Skill with ID '{skill_id}' does not exist."})

        # Prevent duplicate skills
        if FreelancerSkill.objects.filter(freelancer=user, skill=skill).exists():
            raise ValidationError({"error": f"You already have the skill '{skill.name}'."})

        serializer.save(freelancer=user, skill=skill, level=level)

    def perform_update(self, serializer):
        level = self.request.data.get('level')

        if level is not None and (int(level) < 0 or int(level) > 100):
            raise ValidationError({"error": "Skill level must be between 0 and 100"})

        serializer.save()


class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [AllowAny]

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
    permission_classes = []

    # def perform_create(self, serializer):
    #     serializer.save(freelancer=self.request.user)

# Freelancer Portfolio ViewSet
class PortfolioViewSet(viewsets.ModelViewSet):
    queryset = Portfolio.objects.all()
    serializer_class = PortfolioSerializer
    permission_classes = []

    def get_queryset(self):
        # Only allow freelancers to access their own portfolios
        return Portfolio.objects.filter(freelancer=self.request.user)

    def perform_create(self, serializer):
        serializer.save(freelancer=self.request.user)


# Freelancer Skill ViewSet
class FreelancerSkillViewSet(viewsets.ModelViewSet):
    queryset = FreelancerSkill.objects.all()
    serializer_class = FreelancerSkillSerializer
    permission_classes = []

    def get_queryset(self):
        # Freelancer can only access their own skills
        if self.action in ['list', 'retrieve']:
            return FreelancerSkill.objects.filter(freelancer=self.request.user).select_related('skill')
        return super().get_queryset()

    def perform_create(self, serializer):
        user = self.request.user
        skill_id = self.kwargs.get('skill_id')
        level = self.request.data.get('level')

        # Validate level
        if level is None or int(level) < 0 or int(level) > 100:
            raise ValidationError({"error": "Skill level must be between 0 and 100"})

        # Validate skill existence
        try:
            skill = Skill.objects.get(id=skill_id)
        except Skill.DoesNotExist:
            raise ValidationError({"error": f"Skill with ID '{skill_id}' does not exist."})

        # Prevent duplicate skills
        if FreelancerSkill.objects.filter(freelancer=user, skill=skill).exists():
            raise ValidationError({"error": f"You already have the skill '{skill.name}'."})

        serializer.save(freelancer=user, skill=skill, level=level)

    def perform_update(self, serializer):
        level = self.request.data.get('level')

        if level is not None and (int(level) < 0 or int(level) > 100):
            raise ValidationError({"error": "Skill level must be between 0 and 100"})

        serializer.save()

# Skill ViewSet (Admin only for adding skills)
class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = []

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
    permission_classes = [IsAuthenticated, IsFreelancer]

    def get_queryset(self):
        # Only allow freelancers to access their own experiences
        return Experience.objects.filter(freelancer=self.request.user)

    def perform_create(self, serializer):
        serializer.save(freelancer=self.request.user)

# Freelancer Portfolio ViewSet
class PortfolioViewSet(viewsets.ModelViewSet):
    queryset = Portfolio.objects.all()
    serializer_class = PortfolioSerializer
    permission_classes = []

    def get_queryset(self):
        # Only allow freelancers to access their own portfolios
        return Portfolio.objects.filter(freelancer=self.request.user)

    def perform_create(self, serializer):
        serializer.save(freelancer=self.request.user)

