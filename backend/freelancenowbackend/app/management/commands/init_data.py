from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth.models import Group
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.contrib.auth import get_user_model

from app.models import (
    UserRole, Notification, UserNotification, Company, Area, UserCompany,
    Freelancer, SkillType, Skill, FreelancerSkill, Experience, Portfolio, Comment,
    ProjectStatus, Project, ProjectFreelancer, ProjectSkill, Milestone, Deliverable, Payment,
    # Asegúrate de que Country y City están correctamente importados si los estás usando
    Country, City
)

User = get_user_model()

class Command(BaseCommand):
    help = 'Carga datos iniciales para pruebas.'

    def handle(self, *args, **options):
        pass
