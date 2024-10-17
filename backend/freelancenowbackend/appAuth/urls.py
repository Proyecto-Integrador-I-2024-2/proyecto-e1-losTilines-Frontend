from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'freelancers', FreelancerViewSet, basename='freelancer')
router.register(r'business-managers', BusinessManagerViewSet, basename='business-manager')
router.register(r'project-managers', ProjectManagerViewSet, basename='project-manager')
router.register(r'admin-areas', AdminAreaViewSet, basename='admin-area')
router.register(r'companies', CompanyViewSet, basename='companies')
router.register(r'users', UserRoleViewSet, basename='users')

urlpatterns = [
    path('', include(router.urls)),
]



