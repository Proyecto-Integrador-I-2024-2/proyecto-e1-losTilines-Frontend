from django.urls import path
from .views import FreelancerSkillView, FreelancerSkillAddView, SkillCreateView

urlpatterns = [
    path('skills/', FreelancerSkillView.as_view(), name='skill-list'),
    path('skills/create/', SkillCreateView.as_view(), name='skill-create'),
    path('skills/add/', FreelancerSkillAddView.as_view(), name='skill-add'),
]