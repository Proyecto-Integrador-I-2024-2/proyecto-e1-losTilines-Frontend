import django_filters
from app.models import Project, ProjectFreelancer, Milestone
from django.db.models import Q
from app.models import Project, ProjectFreelancer, UserCompany, Area

class ProjectFilter(django_filters.FilterSet):
    # Project by owner
    user = django_filters.NumberFilter(field_name='user_id', label="Owner")

    # Project by area
    area_user = django_filters.NumberFilter(method='filter_area_user', label="Area admin")
    area = django_filters.NumberFilter(field_name='user__usercompany__area_id', label="Area")

    # Project by company
    company_user = django_filters.NumberFilter(method='filter_company_user', label="Business Manager")
    company = django_filters.NumberFilter(field_name='user__usercompany__company_id', label="Company")

    freelancer = django_filters.NumberFilter(method='filter_freelancer', label="Freelancer")

    class Meta:
        model = Project
        fields = ['user', 'status', 'area_user', 'company_user', 'area', 'company']

    def filter_area_user(self, queryset, name, value):
        user_company = UserCompany.objects.filter(user_id=value).first()
        if user_company and user_company.area:
            return queryset.filter(
                user__usercompany__area=user_company.area
            )
        else:
            return queryset.none()
        
    def filter_company_user(self, queryset, name, value):
        user_company = UserCompany.objects.filter(user_id=value).first()
        print(user_company)
        print(user_company.company)
        if user_company and user_company.company:
            return queryset.filter(
                user__usercompany__company=user_company.company
            )
        else:
            return queryset.none()
        
    def filter_freelancer(self, queryset, name, value):
        return queryset.filter(
            projectfreelancer__freelancer_id=value
        )

# class MilestoneFilter(django_filters.FilterSet):
#     project = django_filters.NumberFilter()
#     freelancer = django_filters.NumberFilter(field_name='')

#     class Meta:
#         model = Milestone
#         fields = ['project', 'freelancer']

