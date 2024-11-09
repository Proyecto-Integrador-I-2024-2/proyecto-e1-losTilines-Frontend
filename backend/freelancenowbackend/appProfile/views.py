from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from app.models import Skill, Experience
from app.serializers import SkillSerializer, ExperienceSerializer
from rest_framework.exceptions import ValidationError, PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend
from .filters import *
from .serializers import *
from rest_framework.response import Response
from app.permission import IsOwnerOrReadOnly
from app.models import Freelancer, FreelancerSkill, Comment

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

class FreelancerSkillViewSet(viewsets.ModelViewSet):
    queryset = FreelancerSkill.objects.all()
    serializer_class = FreelancerSkillSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = FreelancerSkillFilter

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        user = self.request.user
        try:
            freelancer = Freelancer.objects.get(user=user)
            serializer.save(freelancer=freelancer)
        except Freelancer.DoesNotExist:
            raise PermissionDenied("You must be a freelancer to add skills.")

    def perform_update(self, serializer):
        instance = self.get_object()
        if instance.freelancer.user != self.request.user:
            raise PermissionDenied("You can only update your own skills.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.freelancer.user != self.request.user:
            raise PermissionDenied("You can only delete your own skills.")
        instance.delete()

class ExperienceViewSet(viewsets.ModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['freelancer']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        user = self.request.user
        try:
            freelancer = Freelancer.objects.get(user=user)
            serializer.save(freelancer=freelancer)
        except Freelancer.DoesNotExist:
            raise PermissionDenied("You must be a freelancer to add experiences.")

    def perform_update(self, serializer):
        instance = self.get_object()
        if instance.freelancer.user != self.request.user:
            raise PermissionDenied("You can only update your own experiences.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.freelancer.user != self.request.user:
            raise PermissionDenied("You can only delete your own experiences.")
        instance.delete()

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

        if Skill.objects.filter(name=skill_name).exists():
            raise ValidationError({"error": f"Skill with name '{skill_name}' already exists."})

        serializer.save(name=skill_name)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permissions = [AllowAny]
    filterset_fields = ['freelancer', 'writer']

    def perform_create(self, serializer):
        serializer.save(writer=self.request.user)

    @action(detail=True, methods=['patch'], serializer_class=FreelancerResponseSerializer)
    def respond(self, request, pk=None):
        comment = self.get_object()
        if request.user != comment.freelancer.user:
            return Response({"error": "Only the freelancer can respond to this comment"}, status=403)
        serializer = self.get_serializer(comment, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
