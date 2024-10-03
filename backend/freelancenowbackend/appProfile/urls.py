from rest_framework.routers import DefaultRouter
from .views import *
from django.urls import path, include

router = DefaultRouter()
router.register(r'freelancer', FreelancerDetailViewSet)
router.register(r'skills', SkillViewSet)
router.register(r'experience', ExperienceViewSet, basename='freelancer-experience')

urlpatterns = [
    path('', include(router.urls)),
] 
