from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import Group
from rest_framework.authtoken.models import Token
from app.models import User, Company, UserRole, Freelancer, UserCompany

# Test para registrar usuarios y validaciones
class UserRegistrationTests(APITestCase):
    
    def setUp(self):
        # Crear los grupos para los diferentes roles
        Group.objects.create(name="Freelancer")
        Group.objects.create(name="Business Manager")
        Group.objects.create(name="Area Admin")
        Group.objects.create(name="Project Manager")

    # Test para registrar un Freelancer
    def test_register_freelancer(self):
        url = reverse('register_freelancer')
        data = {
            'email': 'freelancer@example.com',
            'first_name': 'John',
            'last_name': 'Doe',
            'password': 'testpassword123',
            'phone_number': '1234567890'
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        freelancer = User.objects.get(email='freelancer@example.com')
        self.assertTrue(freelancer.groups.filter(name='Freelancer').exists())
        self.assertTrue(Freelancer.objects.filter(user=freelancer).exists())

    # Test para registrar un Business Manager
    def test_register_business_manager(self):
        url = reverse('register_business_manager')  
        data = {
            'email': 'manager@example.com',
            'first_name': 'Jane',
            'last_name': 'Smith',
            'password': 'testpassword123',
            'phone_number': '0987654321'
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        business_manager = User.objects.get(email='manager@example.com')
        self.assertTrue(business_manager.groups.filter(name='Business Manager').exists())

    # Test para validar campos requeridos
    def test_register_fails_without_required_fields(self):
        url = reverse('register_freelancer')
        data = {
            'email': 'freelancer@example.com',
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

# Test para la creación de empresas
class CompanyTests(APITestCase):
    
    def setUp(self):
        self.manager_group = Group.objects.create(name="Business Manager")
        self.manager = User.objects.create_user(
            email='manager@example.com', 
            password='testpassword123', 
            first_name='Manager', 
            last_name='Test'
        )
        self.manager.groups.add(self.manager_group)
        self.client.force_authenticate(user=self.manager)  

    def test_create_company(self):
        url = reverse('creation_company')  
        data = {
            'tax_id': '123456789',
            'name': 'Test Company',
            'address': '123 Main St',
            'telephone': '+1234567890',
            'email': 'company@example.com',
            'description': 'A test company',
            'industry': 'Technology'
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        company = Company.objects.get(name='Test Company')
        self.assertEqual(company.email, 'company@example.com')
        self.assertEqual(UserCompany.objects.filter(user=self.manager, company=company).exists(), True)