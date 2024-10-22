from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
#Tested
router.register(r'freelancers', FreelancerViewSet, basename='freelancers') #Tested
router.register(r'business-managers', BusinessManagerViewSet, basename='business-managers') #Tested
router.register(r'project-managers', ProjectManagerViewSet, basename='project-managers') 
router.register(r'admin-areas', AdminAreaViewSet, basename='admin-areas')
router.register(r'companies', CompanyViewSet, basename='companies')
router.register(r'users', UserRoleViewSet, basename='users')

urlpatterns = [
    path('', include(router.urls)),
]



