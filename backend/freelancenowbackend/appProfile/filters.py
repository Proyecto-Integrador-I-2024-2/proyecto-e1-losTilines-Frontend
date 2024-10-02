import django_filters
from app.models import Skill, Experience, User

class SkillFilter(django_filters.FilterSet):
    user = django_filters.NumberFilter(field_name='freelancerskill__freelancer__id', lookup_expr='icontains')

    class Meta:
        model = Skill
        fields = ['user']

class ExperienceFilter(django_filters.FilterSet):
    user = django_filters.NumberFilter(field_name='freelancer_id')

    class Meta:
        model = Experience
        fields = ['user']