# asgi.py
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path
from appComunication.routing import websocket_urlpatterns

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "freelancenowbackend.settings")

django_asgi_app = get_asgi_application()

from appComunication.middleware import TokenAuthMiddleware

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": TokenAuthMiddleware(
        URLRouter(websocket_urlpatterns)
    ),
})