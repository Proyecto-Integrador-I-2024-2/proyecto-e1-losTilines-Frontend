from rest_framework import serializers
from app.models import Comment, Freelancer
from django.core.exceptions import ValidationError
from app.serializers import FreelancerSerializer, UserSerializer, StatusSerializer

class CommentSerializer(serializers.ModelSerializer):
    # Acepta solo el ID del freelancer al crear o actualizar, pero devuelve la información completa en la respuesta
    freelancer = serializers.PrimaryKeyRelatedField(queryset=Freelancer.objects.all(), write_only=True)
    freelancer_details = FreelancerSerializer(source='freelancer', read_only=True)  # Detalles del freelancer
    writer = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['freelancer', 'freelancer_details', 'title', 'description', 'stars', 'writer']
        read_only_fields = ['writer']

