from django.test import TestCase
from app.models import User, Company, Freelancer, Project, Area, ProjectSkill, UserCompany
from appCompany.serializers import (
    FreelancerSerializer,
    CompanySkillSerializer,
    CompanyDetailSerializer,
    RelatedProjectSerializer,
    WorkerSerializer,
    AreaSerializer
)
from django.contrib.auth.models import Group
from django.db.models import Avg, Count
from datetime import date

class SerializerTestCase(TestCase):

    def create_business_manager_user(self, email="manager@example.com"):
        user = User.objects.create(
            email=email,
            first_name="Manager",
            last_name="User",
            phone_number="123456789"
        )
        group = Group.objects.create(name='Business Manager')
        user.groups.add(group)
        return user

    def create_freelancer_user(self, email="freelancer@example.com"):
        user = User.objects.create(
            email=email,
            first_name="Freelancer",
            last_name="User",
            phone_number="123456789"
        )
        group = Group.objects.get_or_create(name='Freelancer')[0]
        user.groups.add(group)
        return user

    def create_company(self, user=None):
        if user is None:
            user = self.create_business_manager_user()
        return Company.objects.create(
            tax_id="123456789",
            name="Test Company",
            country="Colombia",
            city="Bogotá",
            address="123 Main St",
            telephone="123456789",
            email="company@example.com",
            description="A company for testing",
            industry="Technology",
            user=user
        )

    def create_freelancer(self, user):
        return Freelancer.objects.create(user=user, description="Freelancer description", portfolio="Portfolio link")

    def create_project(self, user, budget=10000):
        return Project.objects.create(
            name="Test Project",
            user=user,
            description="A test project",
            start_date=date.today(),  # Asegurando que se asigne una fecha de inicio válida
            budget=budget  # Asignando un valor al campo `budget` para evitar errores
        )

    def create_area(self, company, user):
        return Area.objects.create(name="Test Area", company=company, user=user)


# --------------------- FreelancerSerializer Test --------------------- #

class FreelancerSerializerTest(SerializerTestCase):
    def setUp(self):
        self.user = self.create_freelancer_user()
        self.freelancer = self.create_freelancer(self.user)

    def test_freelancer_serialization(self):
        serializer = FreelancerSerializer(self.freelancer)
        data = serializer.data
        self.assertEqual(data['description'], self.freelancer.description)
        self.assertEqual(data['user']['name'], f"{self.user.first_name} {self.user.last_name}")
        self.assertEqual(data['user']['img'], self.user.profile_picture)


# --------------------- CompanySkillSerializer Test --------------------- #

class CompanySkillSerializerTest(SerializerTestCase):
    def setUp(self):
        self.company = self.create_company()
        self.skill_data = {
            'skill__id': 1,
            'skill__name': 'Python',
            'project_count': 5,
            'average_level': 85.0
        }

    def test_company_skill_serialization(self):
        serializer = CompanySkillSerializer(self.skill_data)
        data = serializer.data
        self.assertEqual(data['skill_id'], 1)
        self.assertEqual(data['skill_name'], 'Python')
        self.assertEqual(data['project_count'], 5)
        self.assertEqual(data['average_level'], 85.0)


# --------------------- CompanyDetailSerializer Test --------------------- #

#class CompanyDetailSerializerTest(SerializerTestCase):
#    def setUp(self):
#        self.user = self.create_business_manager_user()
#        self.company = self.create_company(user=self.user)
#        self.project = self.create_project(self.user)
#        self.freelancer = self.create_freelancer(self.user)

#    def test_company_detail_serialization(self):
#        serializer = CompanyDetailSerializer(self.company)
#        data = serializer.data
#        self.assertEqual(data['name'], self.company.name)
#        self.assertEqual(data['freelancers'][0]['description'], self.freelancer.description)
#        self.assertEqual(data['projects'][0]['name'], self.project.name)


# --------------------- RelatedProjectSerializer Test --------------------- #

class RelatedProjectSerializerTest(SerializerTestCase):
    def setUp(self):
        self.user = self.create_business_manager_user()
        self.project = self.create_project(self.user)

    def test_related_project_serialization(self):
        serializer = RelatedProjectSerializer(self.project)
        data = serializer.data
        self.assertEqual(data['name'], self.project.name)
        self.assertEqual(data['project_manager'], f"{self.user.first_name} {self.user.last_name}")


# --------------------- WorkerSerializer Test --------------------- #

#class WorkerSerializerTest(SerializerTestCase):
#    def setUp(self):
#        self.user = self.create_business_manager_user()
#        self.company = self.create_company(user=self.user)
#        self.area = self.create_area(self.company, self.user)
#        self.project = self.create_project(self.user)

#    def test_worker_serialization(self):
#        serializer = WorkerSerializer(self.user)
#        data = serializer.data
#        self.assertEqual(data['company'], self.company.id)
#        self.assertEqual(data['area'], self.area.id)
#        self.assertEqual(data['related_projects'][0]['name'], self.project.name)


# --------------------- AreaSerializer Test --------------------- #

class AreaSerializerTest(SerializerTestCase):
    def setUp(self):
        self.user = self.create_business_manager_user()
        self.company = self.create_company(user=self.user)
        self.area = self.create_area(self.company, self.user)

    def test_area_serialization(self):
        serializer = AreaSerializer(self.area)
        data = serializer.data
        self.assertEqual(data['name'], self.area.name)
        self.assertEqual(data['company']['name'], self.company.name)
        self.assertEqual(data['user']['email'], self.user.email)
