from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'workers', WorkerViewSet, basename='workers')
router.register(r'areas', AreaViewSet, basename='areas')

urlpatterns = [
    path('', include(router.urls)),
]