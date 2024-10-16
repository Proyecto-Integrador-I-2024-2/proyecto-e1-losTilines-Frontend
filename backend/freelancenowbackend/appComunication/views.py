from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from app.models import Comment
from rest_framework.exceptions import ValidationError, PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import *
from rest_framework.response import Response
from app.models import Freelancer, FreelancerSkill

# Create your views here.

class CommentViewset(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    filter_backends = [DjangoFilterBackend]
    serializer_class = CommentSerializer
    permission_classes = [AllowAny] #Change it
    filterset_fields = ['freelancer']

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(writer=user)
