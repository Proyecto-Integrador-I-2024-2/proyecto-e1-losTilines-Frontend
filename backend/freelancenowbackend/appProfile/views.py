from app.models import Skill
from .serializers import SkillSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt


@api_view(['GET'])
@csrf_exempt
@permission_classes([AllowAny])
def list_skills(request):
    queryset = Skill.objects.filter(is_predefined=True)
    serializer = SkillSerializer(queryset, many=True)

    return Response(serializer.data)