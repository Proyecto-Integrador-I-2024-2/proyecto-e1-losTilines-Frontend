from rest_framework import serializers
from app.models import Area

class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = ['id', 'name', 'company', 'user']
        extra_kwargs = {
            'company': {'required': False, 'allow_null': True}  # No requerido y puede ser nulo
        }