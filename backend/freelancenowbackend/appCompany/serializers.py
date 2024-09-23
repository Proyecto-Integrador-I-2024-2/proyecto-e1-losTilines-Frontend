from rest_framework import serializers
from app.models import Area, User, UserCompany

class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = ['id', 'name', 'user']
        
    def validate_name(self, value):
        business_manager = self.context['request'].user
        user_company_instance = UserCompany.objects.filter(user=business_manager).first()
        
        if user_company_instance is None:
            raise serializers.ValidationError("No se encontró la compañía asociada con este Business Manager.")
        
        if Area.objects.filter(name=value, company=user_company_instance.company).exists():
            raise serializers.ValidationError("El nombre del área debe ser único por compañía.")
        
        return value

    def validate_user(self, value):
        if value and not value.groups.filter(name='Area Admin').exists():
            raise serializers.ValidationError("El usuario debe pertenecer al grupo 'Area Admin'.")
        return value