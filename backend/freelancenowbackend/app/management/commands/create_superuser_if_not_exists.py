from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os

class Command(BaseCommand):
    help = 'Create a superuser if it does not exist'

    def handle(self, *args, **kwargs):
        # Obtener el modelo de usuario personalizado
        User = get_user_model()
        
        # Recoger los datos de entorno para el superusuario
        email = os.getenv('DJANGO_SUPERUSER_EMAIL')
        password = os.getenv('DJANGO_SUPERUSER_PASSWORD')
        first_name = os.getenv('DJANGO_SUPERUSER_FIRST_NAME', 'Admin')
        last_name = os.getenv('DJANGO_SUPERUSER_LAST_NAME', 'User')

        # Verificar si ya existe un usuario con ese correo
        if not User.objects.filter(email=email).exists():
            # Crear el superusuario con los datos proporcionados
            User.objects.create_superuser(
                email=email, 
                password=password, 
                first_name=first_name, 
                last_name=last_name
            )
            
            self.stdout.write(self.style.SUCCESS(f'Superuser "{email}" has been created'))
        else:
            self.stdout.write(self.style.SUCCESS(f'Superuser "{email}" already exists'))
