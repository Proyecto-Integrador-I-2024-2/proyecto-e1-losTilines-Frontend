from django.urls import path
from .views import FreelancerSkillView

urlpatterns = [
    path('skills/', FreelancerSkillView.as_view(), name='skill-list'),
]