from django.forms import ValidationError
from rest_framework import generics
from app.models import Company, Skill, FreelancerSkill, SkillType, Experience, Portfolio, UserCompany
from rest_framework import serializers, permissions
from appAuth.serializers import CompanySerializer
from .serializers import SkillSerializer, FreelancerSkillSerializer, ExperienceSerializer, PortfolioSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from appAuth.permission import IsFreelancer
from rest_framework.exceptions import PermissionDenied

# ------------ FREELANCER VIEWS ------------

# List all skills of the logged-in freelancer
class FreelancerSkillView(generics.ListAPIView):
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated, IsFreelancer]

    def get_queryset(self):
        user = self.request.user
        return Skill.objects.filter(freelancerskill__freelancer=user)

# Create a new skill
class SkillCreateView(generics.CreateAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [IsAdminUser]  # Cambiado a IsAdminUser

    def perform_create(self, serializer):
        skill_name = self.request.data.get('name')
        is_predefined = self.request.data.get('is_predefined', False)
        skill_type_name = self.request.data.get('type')

        skill_type, created = SkillType.objects.get_or_create(name=skill_type_name)

        if Skill.objects.filter(name=skill_name).exists():
            raise ValidationError({"error": f"Skill with name '{skill_name}' already exists."})

        serializer.save(name=skill_name, is_predefined=is_predefined, type=skill_type)

# Add a skill to logged in freelancer
class FreelancerSkillAddView(generics.CreateAPIView):
    queryset = FreelancerSkill.objects.all()
    serializer_class = FreelancerSkillSerializer
    permission_classes = [IsAuthenticated, IsFreelancer]

    def perform_create(self, serializer):
        user = self.request.user
        skill_id = self.kwargs['pk'] 
        level = self.request.data.get('level')

        if level is None or int(level) < 0 or int(level) > 100:
            raise ValidationError({"error": "Skill level must be between 0 and 100"})

        try:
            skill = Skill.objects.get(id=skill_id)
        except Skill.DoesNotExist:
            raise ValidationError({"error": f"Skill with ID '{skill_id}' does not exist."})

        if FreelancerSkill.objects.filter(freelancer=user, skill=skill).exists():
            raise ValidationError({"error": f"You already have the skill '{skill.name}'."})

        serializer.save(freelancer=user, skill=skill, level=level)

# Edit a skill of logged in freelancer
class FreelancerSkillEditView(generics.UpdateAPIView):
    queryset = FreelancerSkill.objects.all()
    serializer_class = FreelancerSkillSerializer
    permission_classes = [IsAuthenticated, IsFreelancer]

    def get_object(self):
        user = self.request.user
        skill_id = self.kwargs['pk']
        try:
            freelancer_skill = FreelancerSkill.objects.get(id=skill_id, freelancer=user)
        except FreelancerSkill.DoesNotExist:
            raise ValidationError({"error": "You do not have permission to edit this skill."})
        return freelancer_skill

    def perform_update(self, serializer):
        level = self.request.data.get('level')

        if level is not None and (int(level) < 0 or int(level) > 100):
            raise ValidationError({"error": "Skill level must be between 0 and 100"})

        serializer.save()

# Delete a skill of logged in freelancer
class FreelancerSkillDeleteView(generics.DestroyAPIView):
    queryset = FreelancerSkill.objects.all()
    permission_classes = [IsAuthenticated, IsFreelancer]

    def get_object(self):
        user = self.request.user
        skill_id = self.kwargs['pk']
        try:
            freelancer_skill = FreelancerSkill.objects.get(id=skill_id, freelancer=user)
        except FreelancerSkill.DoesNotExist:
            raise ValidationError({"error": "You do not have permission to delete this skill."})
        return freelancer_skill

# List and create experience
class ExperienceListCreateView(generics.ListCreateAPIView):
    serializer_class = ExperienceSerializer
    permission_classes = [IsAuthenticated, IsFreelancer]

    def get_queryset(self):
        user = self.request.user
        return Experience.objects.filter(freelancer=user)

    def perform_create(self, serializer):
        serializer.save(freelancer=self.request.user)

# Retrieve, update and delete experience
class ExperienceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        obj = super().get_object()
        if obj.freelancer != self.request.user:
            raise ValidationError("You do not have permission to access this experience.")
        return obj

# List and create portfolio
class PortfolioListCreateView(generics.ListCreateAPIView):
    serializer_class = PortfolioSerializer
    permission_classes = [IsAuthenticated, IsFreelancer]

    def get_queryset(self):
        user = self.request.user
        return Portfolio.objects.filter(freelancer=user)

    def perform_create(self, serializer):
        serializer.save(freelancer=self.request.user)

# Retrieve, update and delete portfolio
class PortfolioDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Portfolio.objects.all()
    serializer_class = PortfolioSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        obj = super().get_object()
        if obj.freelancer != self.request.user:
            raise ValidationError("You do not have permission to access this portfolio.")
        return obj
    
# ------------ COMPANY VIEWS ------------

# Show and update company information 
class CompanyRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        user = self.request.user

        if not user.groups.filter(name='Business Manager').exists():
            raise PermissionDenied({"error": "You are not authorized to update company information."})

        user_company_instance = UserCompany.objects.filter(user=user).first()

        if user_company_instance is None:
            raise serializers.ValidationError("No company associated with this Business Manager.")

        return user_company_instance.company

    def update(self, request, *args, **kwargs):
        company = self.get_object()

        return super().update(request, *args, **kwargs)