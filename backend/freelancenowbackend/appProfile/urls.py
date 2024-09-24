from django.urls import path
from .views import * 

urlpatterns = [
    path('info/', UserInfoView.as_view(), name = "user-info"),
    path('all/skills/', AllSkillView.as_view(), name="all-skills"),
    path('skills/', FreelancerSkillView.as_view(), name='skill-list'),
    path('skills/<int:freelancer_id>/', FreelancerSkillIdView.as_view(), name='skill-id'),
    path('skills/create/', SkillCreateView.as_view(), name='skill-create'),
    path('skills/add/<int:pk>/', FreelancerSkillAddView.as_view(), name='skill-add'),  
    path('skills/edit/<int:pk>/', FreelancerSkillEditView.as_view(), name='skill-edit'),
    path('skills/delete/<int:pk>/', FreelancerSkillDeleteView.as_view(), name='skill-delete'),
    path('experience/<int:freelancer_id>/', ExperienceListByFreelancerIdView.as_view(), name='experience-list-id'),
    path('experiences/', ExperienceListCreateView.as_view(), name='experience-list-create'),
    path('experiences/<int:pk>/', ExperienceDetailView.as_view(), name='experience-detail'),
    path('portfolio/<int:freelancer_id>/', PortfolioListByFreelancerIdView.as_view(), name='portfolio-list-id'),
    path('portfolios/', PortfolioListCreateView.as_view(), name='portfolio-list-create'),
    path('portfolios/<int:pk>/', PortfolioDetailView.as_view(), name='portfolio-detail'),
    path('company/', CompanyRetrieveUpdateView.as_view(), name='company-retrieve-update'),
    path('companies/', ListCompanyView.as_view(), name='list-companies'),
    path('companies/<int:pk>/', DetailCompanyView.as_view(), name='detail-company')
]