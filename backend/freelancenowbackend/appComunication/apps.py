from django.apps import AppConfig

class AppComunicationConfig(AppConfig):
    name = 'appComunication'

    def ready(self):
        import appComunication.signals