import django_filters
from app.models import Skill, Experience, User, FreelancerSkill

class SkillFilter(django_filters.FilterSet):
    user = django_filters.NumberFilter(field_name='freelancerskill__freelancer__id', lookup_expr='icontains')

    class Meta:
        model = Skill
        fields = ['user']

class FreelancerSkillFilter(django_filters.FilterSet):
    user = django_filters.NumberFilter(field_name='freelancer__id', lookup_expr='icontains')

    class Meta:
        model = FreelancerSkill
        fields = ['user']

class ExperienceFilter(django_filters.FilterSet):
    user = django_filters.NumberFilter(field_name='freelancer_id')

    class Meta:
        model = Experience
        fields = ['user']