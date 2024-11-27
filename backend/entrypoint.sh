#!/bin/bash

# Ejecutar migraciones y otras tareas necesarias para iniciar la app
echo "Starting the backend container..."

# Limpiar la base de datos y ejecutar migraciones
python manage.py flush --no-input

echo "Pasó flush"

python manage.py makemigrations

echo "Pasó migraciones"

python manage.py migrate

echo "Pasó migrar"

python manage.py cargar_datos

echo "Pasó Data init"

# Iniciar Daphne para servir la aplicación
daphne -p 8000 -b 0.0.0.0 freelancenowbackend.asgi:application
