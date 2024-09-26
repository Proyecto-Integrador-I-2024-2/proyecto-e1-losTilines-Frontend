from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView,
    CreateCompanyView,
)

router = DefaultRouter()
router.register(r'register', RegisterView, basename='register')
router.register(r'companies', CreateCompanyView, basename='companies')

urlpatterns = [
    path('', include(router.urls)),
]
