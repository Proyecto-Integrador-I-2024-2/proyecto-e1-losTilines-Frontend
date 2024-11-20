from django.test import TestCase
from django.contrib.auth.models import Group
from django.core.exceptions import ValidationError
from app.models import (
    User, UserRole, Company, Area, UserCompany, Freelancer, Skill, FreelancerSkill, Experience,
    Comment, Project, ProjectFreelancer, ProjectSkill, Milestone, Deliverable, Payment
)
from django.utils import timezone
from datetime import date, timedelta


class ModelTests(TestCase):
    def setUp(self):
        # Crear grupo
        self.freelancer_group = Group.objects.create(name="Freelancer")
        self.business_manager_group = Group.objects.create(name="Business Manager")
        self.area_admin_group = Group.objects.create(name="Area Admin")
        self.project_manager_group = Group.objects.create(name="Project Manager")

        # Crear usuarios
        self.user_freelancer = User.objects.create_user(email="freelancer@example.com", password="test123")
        self.user_freelancer.groups.add(self.freelancer_group)

        self.user_business_manager = User.objects.create_user(email="business@example.com", password="test123")
        self.user_business_manager.groups.add(self.business_manager_group)

        self.user_area_admin = User.objects.create_user(email="area@example.com", password="test123")
        self.user_area_admin.groups.add(self.area_admin_group)

        # Crear compañía
        self.company = Company.objects.create(
            tax_id="123456789",
            name="Test Company",
            address="123 Street",
            telephone="+123456789",
            email="company@example.com",
            user=self.user_business_manager
        )

        # Crear área
        self.area = Area.objects.create(
            name="IT",
            company=self.company,
            user=self.user_area_admin
        )

        # Crear freelancer
        self.freelancer = Freelancer.objects.create(
            user=self.user_freelancer,
            description="Experienced developer",
            country="Colombia",
            city="Bogotá"
        )

        # Crear proyecto
        self.project = Project.objects.create(
            name="Test Project",
            description="A test project",
            start_date=date.today(),
            user=self.user_area_admin,
            budget=1000.00
        )

    def test_user_role_assignment(self):
        # Validar la asignación correcta de roles a los usuarios
        role = UserRole.objects.create(user=self.user_freelancer, role=self.freelancer_group)
        self.assertEqual(str(role), str(self.user_freelancer))

    def test_company_creation_with_invalid_user(self):
        # Intentar crear una compañía con un usuario que no sea Business Manager
        with self.assertRaises(ValueError):
            Company.objects.create(
                tax_id="987654321",
                name="Invalid Company",
                address="456 Street",
                telephone="+987654321",
                email="invalid@example.com",
                user=self.user_freelancer
            )

    def test_freelancer_creation_with_invalid_group(self):
        # Intentar crear un freelancer con un usuario que no sea del grupo Freelancer
        user = User.objects.create_user(email="invalid@example.com", password="test123")
        with self.assertRaises(ValueError):
            Freelancer.objects.create(user=user, description="Invalid Freelancer")

    def test_milestone_due_date_validation(self):
        # Validar que la fecha de entrega de un hito no sea anterior a la fecha de inicio del proyecto
        with self.assertRaises(ValidationError):
            milestone = Milestone(
                name="Milestone 1",
                description="First milestone",
                due_date=date.today() - timedelta(days=1),
                freelancer=self.freelancer,
                project=self.project
            )
            milestone.clean()

    def test_comment_creation_with_invalid_user(self):
        # Intentar crear un comentario con un freelancer como autor
        with self.assertRaises(ValueError):
            Comment.objects.create(
                description="Great job",
                stars=5.0,
                freelancer=self.freelancer,
                writer=self.user_freelancer
            )

    def test_payment_creation(self):
        # Validar creación correcta de pagos
        payment = Payment.objects.create(
            date=date.today(),
            status="pending",
            amount=100.00,
            project=self.project,
            freelancer=self.freelancer
        )
        self.assertEqual(str(payment), f'Payment {payment.id} for Project {self.project.name}')
