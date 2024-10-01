from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register(r'projects', ProjectViewSet, basename="project")
router.register(r'projectsfreelancers', ProjectFreelancerViewSet, basename="projects_freelancers")

urlpatterns = [
    path('', include(router.urls)),
]