from rest_framework import serializers
from app.models import UserCompany, UserRole
from app.serializers import CompanySerializer, AreaSerializer, UserSerializer

class WorkerSerializer(UserSerializer):
    role = serializers.SerializerMethodField()
    company = serializers.SerializerMethodField() 
    area = serializers.SerializerMethodField() 

    class Meta(UserSerializer.Meta):  
        fields = UserSerializer.Meta.fields + ['role', 'company', 'area']  

    def get_role(self, obj):
        user_role = UserRole.objects.filter(user=obj).first()
        if user_role:
            return user_role.role.name
        return None

    def get_company(self, obj):
        user_company = UserCompany.objects.filter(user=obj).first()
        if user_company and user_company.company:
            return CompanySerializer(user_company.company).data
        return None

    def get_area(self, obj):
        user_company = UserCompany.objects.filter(user=obj).first()
        if user_company and user_company.area:
            return AreaSerializer(user_company.area).data
        return None