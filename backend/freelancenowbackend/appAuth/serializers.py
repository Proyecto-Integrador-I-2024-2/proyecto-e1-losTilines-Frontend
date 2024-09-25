from rest_framework import serializers
from app.models import User, Company, UserCompany, Freelancer
from cities_light.models import City, Country

class UserSerializer(serializers.ModelSerializer):
    area = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'phone_number', 'profile_picture', 'area']
        # Asegúrate de incluir otros campos que desees exponer

    def get_area(self, obj):
        """
        Obtiene el nombre del área asociada al usuario a través de UserCompany.
        """
        try:
            user_company = UserCompany.objects.select_related('area').get(user=obj)
            if user_company.area:
                return user_company.area.name
            return None
        except UserCompany.DoesNotExist:    
            return None
    
class FreelancerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Freelancer
        fields = ['user', 'description', 'country', 'city']

    def create(self, validated_data):
        freelancer = Freelancer.objects.create(**validated_data)
        return freelancer

    def update(self, instance, validated_data):
        instance.description = validated_data.get('description', instance.description)
        instance.country = validated_data.get('country', instance.country)
        instance.city = validated_data.get('city', instance.city)
        instance.save()
        return instance

class CompanySerializer(serializers.ModelSerializer):
    country = serializers.PrimaryKeyRelatedField(queryset=Country.objects.all(), required=False)
    city = serializers.PrimaryKeyRelatedField(queryset=City.objects.all(), required=False)

    class Meta:
        model = Company
        fields = [
            'tax_id', 'name', 'country', 'city', 'address', 'telephone', 'email', 
            'description', 'industry'
        ]  

    def update(self, instance, validated_data):
        instance.country = validated_data.get('country', instance.country)
        instance.email = validated_data.get('email', instance.email)
        instance.city = validated_data.get('city', instance.city)
        instance.address = validated_data.get('address', instance.address)
        instance.description = validated_data.get('description', instance.description)
        instance.industry = validated_data.get('industry', instance.industry)

        instance.save()
        return instance
    
    def create(self, validated_data):
        return super().create(validated_data)

class UserCompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCompany
        fields = ['company', 'user']

    def validate_user(self, value):
        if value.groups.filter(name="Freelancer").exists():
            raise serializers.ValidationError("Este tipo de usuario no puede estar en una compañía.")
        return value