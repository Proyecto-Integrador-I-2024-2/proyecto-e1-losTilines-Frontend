from django.test import TestCase
from app.models import User, Company, Freelancer, UserCompany, Area
from app.serializers import UserSerializer, FreelancerSerializer, CompanySerializer, UserCompanySerializer
from django.contrib.auth.models import Group

class SerializerTestCase(TestCase):

    def create_freelancer_user(self, email="freelancer@example.com"):
        user = User.objects.create(email=email, first_name="Freelancer", last_name="User", phone_number="123456789")
        group = Group.objects.create(name='Freelancer')
        user.groups.add(group)
        freelancer = Freelancer.objects.create(user=user, description="Freelancer description", country="Colombia", city="Bogotá")
        return user, freelancer

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

    def create_company(self, user=None):
        if user is None:
            user = self.create_business_manager_user()  # Crea un usuario Business Manager si no se proporciona
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
            user=user  # Asegúrate de asociar el usuario a la compañía
        )

    def create_area(self, company, user):
        return Area.objects.create(name="Test Area", company=company, user=user)

# --------------------- UserSerializer Test --------------------- #

class UserSerializerTest(SerializerTestCase):
    def setUp(self):
        self.data = {
            'email': 'testuser@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'phone_number': '123456789',
            'password': 'strong_password_123',
            'profile_picture': 'path/to/image.jpg',
            'created_at': '2024-10-22'
        }

    def test_user_serialization(self):
        user = User.objects.create(**self.data)
        serializer = UserSerializer(user)
        data = serializer.data
        self.assertEqual(data['email'], self.data['email'])

def test_user_deserialization(self):
    data = {
        'email': 'newuser@example.com',
        'first_name': 'New',
        'last_name': 'User',
        'phone_number': '987654321',
        'password': 'new_password_123',
        'profile_picture': 'path/to/image.jpg'
    }
    serializer = UserSerializer(data=data)
    self.assertTrue(serializer.is_valid(), serializer.errors)  # Imprime los errores en caso de fallo
    user = serializer.save()
    self.assertEqual(user.email, data['email'])
    self.assertTrue(user.check_password(data['password']))


# --------------------- FreelancerSerializer Test --------------------- #

class FreelancerSerializerTest(SerializerTestCase):
    def setUp(self):
        self.user, self.freelancer = self.create_freelancer_user()

    def test_freelancer_serialization(self):
        serializer = FreelancerSerializer(self.freelancer)
        data = serializer.data
        self.assertEqual(data['description'], self.freelancer.description)

def test_freelancer_deserialization(self):
    data = {
        'user': self.user.id,  # Proporciona el ID del usuario
        'description': 'New description',
        'country': 'Argentina',
        'city': 'Buenos Aires'
    }
    serializer = FreelancerSerializer(instance=self.freelancer, data=data)
    self.assertTrue(serializer.is_valid(), serializer.errors)  # Imprime los errores en caso de fallo
    freelancer = serializer.save()
    self.assertEqual(freelancer.description, data['description'])



# --------------------- CompanySerializer Test --------------------- #

class CompanySerializerTest(SerializerTestCase):
    def setUp(self):
        self.user = self.create_business_manager_user()  # Crear usuario Business Manager
        self.company = self.create_company(user=self.user)  # Pasar el usuario al crear la compañía

    def test_company_serialization(self):
        serializer = CompanySerializer(self.company)
        data = serializer.data
        self.assertEqual(data['name'], self.company.name)

def test_company_deserialization(self):
    data = {
        'tax_id': '123456789',
        'name': 'Updated Company',
        'country': 'Chile',
        'city': 'Santiago',
        'address': '123 Main St',
        'telephone': '123456789',
        'email': 'updated@test.com',
        'description': 'Updated description',
        'industry': 'Tech',
        'user': self.user.id  # Asegúrate de pasar el ID del usuario relacionado
    }
    serializer = CompanySerializer(instance=self.company, data=data)
    self.assertTrue(serializer.is_valid(), serializer.errors)  # Imprime los errores en caso de fallo
    company = serializer.save()
    self.assertEqual(company.name, data['name'])
    self.assertEqual(company.city, data['city'])


# --------------------- UserCompanySerializer Test --------------------- #

class UserCompanySerializerTest(SerializerTestCase):
    def setUp(self):
        self.user = self.create_business_manager_user()  # Crear usuario Business Manager
        self.company = self.create_company(user=self.user)  # Asegurar que la compañía tiene un usuario
        self.area = self.create_area(self.company, self.user)
        self.user_company = UserCompany.objects.create(user=self.user, company=self.company, area=self.area)

    def test_user_company_serialization(self):
        serializer = UserCompanySerializer(self.user_company)
        data = serializer.data
        self.assertEqual(data['user']['email'], self.user.email)
        self.assertEqual(data['company']['name'], self.company.name)

def test_invalid_freelancer_user_company(self):
    freelancer, _ = self.create_freelancer_user()
    data = {
        'user': {
            'email': freelancer.email,
            'first_name': freelancer.first_name,
            'last_name': freelancer.last_name
        },
        'company': {
            'name': self.company.name,
            'tax_id': self.company.tax_id,
            'country': self.company.country,
            'city': self.company.city
        },
        'area': {
            'name': self.area.name,
            'company': self.area.company.name
        }
    }
    serializer = UserCompanySerializer(data=data)
    self.assertFalse(serializer.is_valid(), serializer.errors)  # Imprime los errores en caso de fallo
    self.assertIn('user', serializer.errors)


