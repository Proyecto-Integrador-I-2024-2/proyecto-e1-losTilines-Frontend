from rest_framework import serializers
from app.models import User 
from django.contrib.auth.hashers import make_password


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id', 'name', 'email', 'password', 'first_name', 'last_name', 'phone_number', 'created_at']
        extra_kwargs = {
            'password': {'write_only': True},  # Ocultar el password en las respuestas
            'created_at': {'read_only': True}  # Evitar que se modifique created_at
        }

    # Puedes agregar validaciones personalizadas si lo necesitas
    def validate_email(self, value):
        if '@example.com' in value:
            raise serializers.ValidationError("No se permiten correos electrónicos de 'example.com'.")
        return value

    def create(self, validated_data):
        # Aquí podrías encriptar la contraseña si lo deseas
        validated_data['password'] = make_password(validated_data['password'])  # Encriptar la contraseña
        return super(UserSerializer, self).create(validated_data)

    def update(self, instance, validated_data):
        # Si se actualiza la contraseña, la encriptas de nuevo
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super(UserSerializer, self).update(instance, validated_data)
