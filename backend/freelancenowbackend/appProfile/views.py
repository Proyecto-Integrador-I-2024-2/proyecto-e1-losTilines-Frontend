from rest_framework import generics
from app.models import Skill
from .serializers import SkillSerializer

class FreelancerSkillView(generics.ListAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer