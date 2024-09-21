from django.urls import path
from .views import FreelancerSkillView, FreelancerSkillAddView, SkillCreateView, FreelancerSkillEditView, FreelancerSkillDeleteView

urlpatterns = [
    path('skills/', FreelancerSkillView.as_view(), name='skill-list'),
    path('skills/create/', SkillCreateView.as_view(), name='skill-create'),
    path('skills/add/<int:pk>/', FreelancerSkillAddView.as_view(), name='skill-add'),  
    path('skills/edit/<int:pk>/', FreelancerSkillEditView.as_view(), name='skill-edit'),
    path('skills/delete/<int:pk>/', FreelancerSkillDeleteView.as_view(), name='skill-delete'),
]