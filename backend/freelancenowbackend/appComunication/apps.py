from django.apps import AppConfig

class AppComunicationConfig(AppConfig):
    name = 'appComunication'

    def ready(self):
        import backend.freelancenowbackend.appComunication.receivers