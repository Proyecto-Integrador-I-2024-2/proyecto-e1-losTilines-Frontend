from rest_framework import serializers
from app.models import User, Company, UserCompany
from cities_light.models import Country, City

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'phone_number', 'password', 'created_at']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class CompanySerializer(serializers.ModelSerializer):
    country = serializers.PrimaryKeyRelatedField(queryset=Country.objects.all(), required=False)
    city = serializers.PrimaryKeyRelatedField(queryset=City.objects.all(), required=False)

    class Meta:
        model = Company
        fields = ['tax_id', 'name', 'country', 'city', 'address', 'telephone', 'email']  # No incluimos el campo 'user'

    def create(self, validated_data):
        return super().create(validated_data)

class UserCompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCompany
        fields = ['company', 'user']

    def validate_user(self, value):
        """Verifica que el usuario no pertenezca al grupo 'Freelancer'."""
        if value.groups.filter(name="Freelancer").exists():
            raise serializers.ValidationError("Este tipo de usuario no puede estar en una compañía.")
        return value