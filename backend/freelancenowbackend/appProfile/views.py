from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from app.models import Skill, Experience, SkillType
from app.serializers import SkillSerializer, ExperienceSerializer
from rest_framework.exceptions import ValidationError, PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend
from .filters import *
from .serializers import *
from rest_framework.response import Response
from app.permission import IsOwnerOrReadOnly
from app.models import Freelancer, FreelancerSkill

class FreelancerDetailViewSet(viewsets.ModelViewSet):
    queryset = Freelancer.objects.all()
    serializer_class = FreelancerDetailSerializer
    permission_classes = [AllowAny]

    def get_permissions(self):
        if self.action in ['update', 'partial_update']:
            return [IsAuthenticated(), IsOwnerOrReadOnly()]
        return super().get_permissions()

    def create(self, request, *args, **kwargs):
        raise PermissionDenied("Creating freelancer is not allowed.")
        
    def destroy(self, request, *args, **kwargs):
        raise PermissionDenied("Deleting freelancer is not allowed.")

# class FreelancerSkillViewSet(viewsets.ModelViewSet):
#     queryset = FreelancerSkill.objects.all()
#     serializer_class = FreelancerSkillSerializer

#     def get_permissions(self):
#         if self.action in ['list', 'retrieve']:
#             return [AllowAny()]
#         elif self.action in ['create', 'update', 'partial_update']:
#             return [IsAuthenticated(), IsOwnerOrReadOnly()]
#         return super().get_permissions()

#     def perform_create(self, serializer):
#         serializer.save(freelancer=self.request.user)

#     def perform_update(self, serializer):
#         freelancer = self.request.user.freelancer
#         serializer.save(freelancer=freelancer)

# class ExperienceViewSet(viewsets.ModelViewSet):
#     queryset = Experience.objects.all()
#     serializer_class = ExperienceSerializer
#     permission_classes = [AllowAny]
#     filter_backends = [DjangoFilterBackend]
#     filterset_class = ExperienceFilter

#     def perform_create(self, serializer):
#         serializer.save(freelancer=self.request.user)

class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [AllowAny]  

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        elif self.action in ['create', 'update', 'partial_update']:
            return [IsAuthenticated(), IsAdminUser()]
        return super().get_permissions()

    def perform_create(self, serializer):
        skill_name = self.request.data.get('name')
        is_predefined = self.request.data.get('is_predefined', False)
        skill_type_name = self.request.data.get('type')

        skill_type, _ = SkillType.objects.get_or_create(name=skill_type_name)

        if Skill.objects.filter(name=skill_name).exists():
            raise ValidationError({"error": f"Skill with name '{skill_name}' already exists."})

        serializer.save(name=skill_name, is_predefined=is_predefined, type=skill_type)