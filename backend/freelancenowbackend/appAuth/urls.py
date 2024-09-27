from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'freelancer', FreelancerViewSet, basename='freelancer')
router.register(r'business-manager', BusinessManagerViewSet, basename='business-manager')
router.register(r'project-manager', ProjectManagerViewSet, basename='project-manager')
router.register(r'admin-area', AdminAreaViewSet, basename='admin-area')


urlpatterns = [
    path('', include(router.urls)),
]



