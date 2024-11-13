from django.core.management.base import BaseCommand
from dataInit.data_init import cargar_datos  # Asegúrate de que el archivo del script se llama `factories.py` o ajusta el nombre según corresponda

class Command(BaseCommand):
    help = 'Carga datos de ejemplo en la base de datos'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('Iniciando carga de datos...'))
        try:
            cargar_datos()
            self.stdout.write(self.style.SUCCESS('Datos cargados exitosamente.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error al cargar datos: {str(e)}'))
