from rest_framework import serializers
from app.models import User, Company, UserCompany, Freelancer
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'phone_number', 'password', 'created_at', 'profile_picture']
        extra_kwargs = {'password': {'write_only': True}}  # No incluir el password en la respuesta

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)  
        user.save() 
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)  # Hashea si hay una nueva contraseña
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

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
    class Meta:
        model = Company
        fields = '__all__'  

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
        fields = ['company', 'user', 'area']

    def validate_user(self, value):
        if value.groups.filter(name="Freelancer").exists():
            raise serializers.ValidationError("Este tipo de usuario no puede estar en una compañía.")
        return value

class SupportRequestSerializer(serializers.Serializer):
    subject = serializers.CharField(max_length=255)
    message = serializers.CharField()
    user_email = serializers.EmailField()
    request_type = serializers.ChoiceField(choices=["question", "complaint", "suggestion"])