from rest_framework import serializers
from app.models import Project
from django.core.exceptions import ValidationError


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'start_date', 'budget', 'area', 'file', 'status', 'user', 'company']
        read_only_fields = ['user', 'company']  


    def validate_status(self, value):
        valid_status = [choice[0] for choice in Project.statusproject]
        if value not in valid_status:
            raise serializers.ValidationError(f"Invalid status. Allowed values are: {', '.join(valid_status)}.")
        return value

    def validate(self, data):
        if 'budget' in data and data['budget'] < 0:
            raise serializers.ValidationError("Budget must be a positive value.")
        return data

    def validate_file(self, value):
        if value and value.size > 5 * 1024 * 1024:  # Limitar a 5MB
            raise serializers.ValidationError("The file size should not exceed 5MB.")
        return value
