from django.urls import path
from .views import FreelancerSkillView, FreelancerSkillAddView

urlpatterns = [
    path('skills/', FreelancerSkillView.as_view(), name='skill-list'),
    path('skills/add/', FreelancerSkillAddView.as_view(), name='skill-add'),
]