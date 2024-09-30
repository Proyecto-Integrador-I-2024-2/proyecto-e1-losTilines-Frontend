from rest_framework import serializers
from app.models import Area, User, UserCompany, UserRole, Company
from rest_framework import serializers
from django.contrib.auth.models import Group

class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = ['id', 'name', 'company']

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name', 'tax_id', 'email', 'telephone']

class RoleSerializer(serializers.ModelSerializer):
    role_name = serializers.CharField(source='role.name')

    class Meta:
        model = UserRole
        fields = ['role_name']

class UserSerializer(serializers.ModelSerializer):
    roles = serializers.SerializerMethodField()  
    company = serializers.SerializerMethodField()  
    area = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'email', 'phone_number', 'created_at', 
            'profile_picture', 'roles', 'company', 'area'
        ]

    def get_roles(self, obj):
        user_roles = UserRole.objects.filter(user=obj)
        return RoleSerializer(user_roles, many=True).data

    def get_company(self, obj):
        user_company = UserCompany.objects.filter(user=obj).first()
        if user_company:
            return CompanySerializer(user_company.company).data
        return None

    def get_area(self, obj):
        user_company = UserCompany.objects.filter(user=obj).first()
        if user_company and user_company.area:
            return AreaSerializer(user_company.area).data
        return None

# class AreaSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Area
#         fields = ['id', 'name', 'user']
        
#     def validate_name(self, value):
#         business_manager = self.context['request'].user
#         user_company_instance = UserCompany.objects.filter(user=business_manager).first()
        
#         if user_company_instance is None:
#             raise serializers.ValidationError("No se encontró la compañía asociada con este Business Manager.")
        
#         if Area.objects.filter(name=value, company=user_company_instance.company).exists():
#             raise serializers.ValidationError("El nombre del área debe ser único por compañía.")
        
#         return value

#     def validate_user(self, value):
#         if value and not value.groups.filter(name='Area Admin').exists():
#             raise serializers.ValidationError("El usuario debe pertenecer al grupo 'Area Admin'.")
#         return value
    
# class GroupSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Group
#         fields = ['id', 'name'] 


# class UserCompanySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = UserCompany
#         fields = ['id', 'company', 'user', 'area']
    
#     def validate_user(self, value):
#         """Custom validation to ensure user is not a freelancer."""
#         if value.groups.filter(name="Freelancer").exists():
#             raise serializers.ValidationError("This user type cannot be in a company.")
#         return value
    

# class UserRoleSerializer(serializers.ModelSerializer):
#     role = serializers.SerializerMethodField()
#     area = serializers.SerializerMethodField()

#     class Meta:
#         model = User
#         fields = ['id', 'email', 'first_name', 'last_name', 'phone_number', 'created_at', 'role', 'area']

#     def get_role(self, obj):
#         user_role = UserRole.objects.filter(user=obj).first()
#         if user_role:
#             return {
#                 "id": user_role.role.id,
#                 "name": user_role.role.name
#             }
#         return None

#     def get_area(self, obj):
#         user_company = UserCompany.objects.filter(user=obj).first()
#         if user_company and user_company.area:
#             return {
#                 "id": user_company.area.id,
#                 "name": user_company.area.name
#             }
#         return None# Si el área es nula o no existe, retorna None