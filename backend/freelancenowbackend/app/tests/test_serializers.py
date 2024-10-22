from django.contrib.auth.models import Group
from django.test import TestCase
from ..serializers import (
    UserSerializer,
    UserRoleSerializer,
    NotificationSerializer,
    CompanySerializer,
    FreelancerSkillSerializer,
    UserNotificationSerializer,
    AreaSerializer,
    UserCompanySerializer,
    FreelancerSerializer,
    ProjectSerializer
)
from ..models import (Company, 
    User, 
    UserRole, 
    Notification, 
    Freelancer, 
    Skill, 
    FreelancerSkill, 
    SkillType, 
    Area, 
    UserNotification, 
    UserCompany,
    Project,
    Status)

class BaseTestCase(TestCase):

    def create_freelancer_user(self, email="freelancer@example.com"):
        user = User.objects.create(email=email)
        group = Group.objects.create(name='Freelancer')
        user.groups.add(group)
        freelancer = Freelancer.objects.create(user=user, description="Freelancer description")
        return user, freelancer  # Return both user and freelancer

    def create_business_manager_user(self, email="manager@example.com"):
        user = User.objects.create(
            email=email,
            first_name="Manager",
            last_name="User",
            phone_number="123456789",
            profile_picture="path/to/image.jpg",
            is_active=True,
            is_staff=False,
        )
        group = Group.objects.create(name='Business Manager')
        user.groups.add(group)
        return user

    def create_company(self, user=None):
        if user is None:
            user = self.create_business_manager_user()  # Create a default Business Manager user
        return Company.objects.create(
            tax_id="123456789",
            name="Test Company",
            country="USA",
            city="New York",
            address="123 Main St",
            telephone="1234567890",
            email="company@example.com",
            description="A company for testing",
            industry="Technology",
            user=user,
        )

class UserSerializerTest(BaseTestCase):
    def setUp(self):
        self.user = User.objects.create(
            email="test@example.com",
            first_name="Test",
            last_name="User",
            phone_number="123456789",
            profile_picture="path/to/image.jpg",
            is_active=True,
            is_staff=False,
        )

    def test_user_serialization(self):
        serializer = UserSerializer(self.user)
        data = serializer.data
        self.assertEqual(data['email'], self.user.email)
        self.assertEqual(data['first_name'], self.user.first_name)

    def test_user_deserialization(self):
        data = {
            'email': 'newuser@example.com',
            'first_name': 'New',
            'last_name': 'User',
            'phone_number': '987654321',
            'is_active': True,
            'is_staff': False
        }
        serializer = UserSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertEqual(user.email, 'newuser@example.com')


class UserRoleSerializerTest(BaseTestCase):
    def setUp(self):
        self.role = Group.objects.create(name='Admin')
        self.user = User.objects.create(email="admin@example.com")
        self.user_role = UserRole.objects.create(user=self.user, role=self.role)

    def test_user_role_serialization(self):
        serializer = UserRoleSerializer(self.user_role)
        data = serializer.data
        self.assertEqual(data['role_name'], 'Admin')
        self.assertEqual(data['user']['email'], self.user.email)


class NotificationSerializerTest(BaseTestCase):
    def setUp(self):
        self.notification = Notification.objects.create(message="Test notification", created_at="2024-09-09")

    def test_notification_serialization(self):
        serializer = NotificationSerializer(self.notification)
        data = serializer.data
        self.assertEqual(data['message'], 'Test notification')


class CompanySerializerTest(BaseTestCase):
    def setUp(self):
        self.user = self.create_business_manager_user()  # Create a Business Manager user
        self.company = self.create_company(user=self.user)  # Create a company associated with that user

    def test_company_serialization(self):
        serializer = CompanySerializer(self.company)
        data = serializer.data
        self.assertEqual(data['name'], 'Test Company')
        self.assertEqual(data['email'], 'company@example.com')


class FreelancerSkillSerializerTest(BaseTestCase):
    def setUp(self):
        self.freelancer_group = Group.objects.create(name='Freelancer')
        self.user = User.objects.create(email="freelancer@example.com")
        self.user.groups.add(self.freelancer_group)

        self.type = SkillType.objects.create(name="Soft skill")
        self.freelancer = Freelancer.objects.create(user=self.user, description="Freelancer description")
        self.skill = Skill.objects.create(name="Python", is_predefined=True, type=self.type)
        self.freelancer_skill = FreelancerSkill.objects.create(freelancer=self.freelancer, skill=self.skill, level=80)

    def test_freelancer_skill_serialization(self):
        serializer = FreelancerSkillSerializer(self.freelancer_skill)
        data = serializer.data
        self.assertEqual(data['skill_name'], 'Python')
        self.assertEqual(data['level'], 80)

    def test_freelancer_skill_invalid_level(self):
        data = {
            'freelancer': self.freelancer,
            'skill': self.skill.id,
            'level': 150  # Invalid level
        }
        serializer = FreelancerSkillSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('level', serializer.errors)


class UserNotificationSerializerTest(BaseTestCase):
    def setUp(self):
        self.user = User.objects.create(email="user@example.com")
        self.notification = Notification.objects.create(message="Test notification", created_at="2024-09-09")
        self.user_notification = UserNotification.objects.create(user=self.user, notification=self.notification)

    def test_user_notification_serialization(self):
        serializer = UserNotificationSerializer(self.user_notification)
        data = serializer.data
        self.assertEqual(data['user']['email'], self.user.email)
        self.assertEqual(data['notification']['message'], self.notification.message)


class AreaSerializerTest(BaseTestCase):
    def setUp(self):
        self.user = self.create_business_manager_user()
        self.company = self.create_company(user=self.user)  # Create company using the base case method
        self.area = Area.objects.create(name="Test Area", company=self.company, user=self.user)

    def test_area_serialization(self):
        serializer = AreaSerializer(self.area)
        data = serializer.data
        self.assertEqual(data['name'], self.area.name)
        self.assertEqual(data['company']['name'], self.company.name)


class UserCompanySerializerTest(BaseTestCase):
    def setUp(self):
        self.user = self.create_business_manager_user()
        self.company = self.create_company(user=self.user)  # Create company using the base case method
        self.area = Area.objects.create(name="Test Area", company=self.company, user=self.user)
        self.user_company = UserCompany.objects.create(user=self.user, company=self.company, area=self.area)

    def test_user_company_serialization(self):
        serializer = UserCompanySerializer(self.user_company)
        data = serializer.data
        self.assertEqual(data['user']['email'], self.user.email)
        self.assertEqual(data['company']['name'], self.company.name)
        self.assertEqual(data['area']['name'], self.area.name)


class FreelancerSerializerTest(BaseTestCase):
    def setUp(self):
        self.user, self.freelancer = self.create_freelancer_user()  # Get both user and freelancer

    def test_freelancer_serialization(self):
        serializer = FreelancerSerializer(self.freelancer)
        data = serializer.data
        self.assertEqual(data['user']['email'], self.user.email)
        self.assertEqual(data['description'], self.freelancer.description)
        



class ProjectSerializerTest(BaseTestCase):

    def setUp(self):
        self.user = self.create_business_manager_user()
        self.status = Status.objects.create(name="In Progress")
        self.project = Project.objects.create(name="Test Project", description="Project description", budget=1000, status=self.status, user=self.user, start_date = "2024-09-09")

    def test_project_serialization(self):
        serializer = ProjectSerializer(self.project)
        data = serializer.data
        self.assertEqual(data['name'], self.project.name)
        self.assertEqual(data['description'], self.project.description)



from django.test import TestCase
from ..serializers import SkillSerializer
from ..models import Skill, SkillType

class SkillSerializerTest(BaseTestCase):

    def setUp(self):
        self.type = SkillType.objects.create(name="Technical")
        self.skill = Skill.objects.create(name="Python", is_predefined=True, type=self.type)

    def test_skill_serialization(self):
        serializer = SkillSerializer(self.skill)
        data = serializer.data
        self.assertEqual(data['name'], self.skill.name)
        self.assertEqual(data['type'], self.type.name)

    def test_skill_creation(self):
        data = {
            'name': 'Django',
            'is_predefined': False,
            'type': 'Web Framework'
        }
        serializer = SkillSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        skill = serializer.save()
        self.assertEqual(skill.name, 'Django')


from django.test import TestCase
from ..serializers import ExperienceSerializer
from ..models import Experience, User, Freelancer

class ExperienceSerializerTest(BaseTestCase):

    def setUp(self):
        self.user, self.freelancer = self.create_freelancer_user() 
        self.experience = Experience.objects.create(
            start_date="2022-01-01",
            final_date="2022-12-31",
            occupation="Developer",
            company="Tech Co.",
            description="Worked on various projects.",
            freelancer=self.freelancer,
        )

    def test_experience_serialization(self):
        serializer = ExperienceSerializer(self.experience)
        data = serializer.data
        self.assertEqual(data['occupation'], self.experience.occupation)
        self.assertEqual(data['company'], self.experience.company)

    def test_experience_valid_dates(self):
        data = {
            'start_date': "2023-01-01",
            'final_date': "2025-01-01",  # Invalid final date
            'occupation': "Developer",
            'company': "Tech Co.",
            'description': "Worked on various projects.",
            'freelancer': self.freelancer,
        }
        serializer = ExperienceSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        





