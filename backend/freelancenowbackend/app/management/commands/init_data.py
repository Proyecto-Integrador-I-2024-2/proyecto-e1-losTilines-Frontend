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
        try:
            # Limpiar datos existentes (opcional, ten cuidado con esto en entornos de producción)
            User.objects.all().delete()
            Group.objects.all().delete()
            Notification.objects.all().delete()
            UserNotification.objects.all().delete()
            Company.objects.all().delete()
            Area.objects.all().delete()
            UserCompany.objects.all().delete()
            Freelancer.objects.all().delete()
            SkillType.objects.all().delete()
            Skill.objects.all().delete()
            FreelancerSkill.objects.all().delete()
            Experience.objects.all().delete()
            Portfolio.objects.all().delete()
            Comment.objects.all().delete()
            ProjectStatus.objects.all().delete()
            Project.objects.all().delete()
            ProjectFreelancer.objects.all().delete()
            ProjectSkill.objects.all().delete()
            Milestone.objects.all().delete()
            Deliverable.objects.all().delete()
            Payment.objects.all().delete()
            Country.objects.all().delete()
            City.objects.all().delete()


        except IntegrityError as e:
            self.stderr.write(self.style.ERROR(f'Error de integridad: {e}'))
        except ValidationError as e:
            self.stderr.write(self.style.ERROR(f'Error de validación: {e}'))
        except Exception as e:
            self.stderr.write(self.style.ERROR(f'Ocurrió un error: {e}'))
