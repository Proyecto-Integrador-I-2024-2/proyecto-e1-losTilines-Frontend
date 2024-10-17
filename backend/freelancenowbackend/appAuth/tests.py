# from django.test import TestCase
# from django.urls import reverse
# from rest_framework import status
# from rest_framework.test import APITestCase
# from django.contrib.auth.models import Group
# from rest_framework.authtoken.models import Token
# from app.models import User, Company, UserRole, Freelancer, UserCompany

# # Test para registrar usuarios y validaciones
# class UserRegistrationTests(APITestCase):
    
#     def setUp(self):
#         # Crear los grupos para los diferentes roles
#         Group.objects.create(name="Freelancer")
#         Group.objects.create(name="Business Manager")
#         Group.objects.create(name="Area Admin")
#         Group.objects.create(name="Project Manager")

#     # Test para registrar un Freelancer
#     def test_register_freelancer(self):
#         url = reverse('register_freelancer')
#         data = {
#             'email': 'freelancer@example.com',
#             'first_name': 'John',
#             'last_name': 'Doe',
#             'password': 'testpassword123',
#             'phone_number': '1234567890'
#         }
#         response = self.client.post(url, data, format='json')
        
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
#         freelancer = User.objects.get(email='freelancer@example.com')
#         self.assertTrue(freelancer.groups.filter(name='Freelancer').exists())
#         self.assertTrue(Freelancer.objects.filter(user=freelancer).exists())

#     # Test para registrar un Business Manager
#     def test_register_business_manager(self):
#         url = reverse('register_business_manager')  
#         data = {
#             'email': 'manager@example.com',
#             'first_name': 'Jane',
#             'last_name': 'Smith',
#             'password': 'testpassword123',
#             'phone_number': '0987654321'
#         }
#         response = self.client.post(url, data, format='json')
        
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
#         business_manager = User.objects.get(email='manager@example.com')
#         self.assertTrue(business_manager.groups.filter(name='Business Manager').exists())

#     # Test para validar campos requeridos
#     def test_register_fails_without_required_fields(self):
#         url = reverse('register_freelancer')
#         data = {
#             'email': 'freelancer@example.com',
#         }
#         response = self.client.post(url, data, format='json')
        
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

# # Test para la creación de empresas
# class CompanyTests(APITestCase):
    
#     def setUp(self):
#         # Crear grupo Business Manager y Area Admin
#         self.business_manager_group, _ = Group.objects.get_or_create(name="Business Manager")
#         self.area_admin_group, _ = Group.objects.get_or_create(name="Area Admin")

#         # Crear usuario Business Manager
#         self.business_manager = User.objects.create_user(
#             email='manager@example.com', password='testpassword123', first_name='Jane', last_name='Smith'
#         )
#         self.business_manager.groups.add(self.business_manager_group)

#         # Autenticar usuario Business Manager
#         self.client.force_authenticate(user=self.business_manager)

#     def test_create_company(self):
#         url = reverse('creation_company')  
#         data = {
#             'tax_id': '123456789',
#             'name': 'Test Company',
#             'address': '123 Main St',
#             'telephone': '+1234567890',
#             'email': 'company@example.com',
#             'description': 'A test company',
#             'industry': 'Technology'
#         }
#         response = self.client.post(url, data, format='json')
        
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)

#     def test_register_area_admin(self):
#         # Crear compañía para el Business Manager
#         self.company = Company.objects.create(
#             tax_id='123456789', name='Test Company', address='123 Main St',
#             telephone='+1234567890', email='company@example.com', user=self.business_manager
#         )
#         UserCompany.objects.create(company=self.company, user=self.business_manager)
#         # Intentar registrar un Area Admin
#         url = reverse('register_area_admin')
#         data = {
#             'email': 'areaadmin@example.com',
#             'first_name': 'Area',
#             'last_name': 'Admin',
#             'password': 'adminpassword123',
#             'phone_number': '0987654321'
#         }
#         response = self.client.post(url, data, format='json')

#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)

#         area_admin = User.objects.get(email='areaadmin@example.com')
#         self.assertTrue(area_admin.groups.filter(name='Area Admin').exists())
#         self.assertTrue(UserCompany.objects.filter(company=self.company, user=area_admin).exists())

#     def test_register_project_manager(self):
#         # Crear compañía para el Business Manager
#         self.company = Company.objects.create(
#             tax_id='123456789', name='Test Company', address='123 Main St',
#             telephone='+1234567890', email='company@example.com', user=self.business_manager
#         )
#         UserCompany.objects.create(company=self.company, user=self.business_manager)
        
#         # Intentar registrar un Project Manager
#         url = reverse('register_project_manager')
#         data = {
#             'email': 'projectmanager@example.com',
#             'first_name': 'Project',
#             'last_name': 'Manager',
#             'password': 'adminpassword123',
#             'phone_number': '0987654321'
#         }
#         response = self.client.post(url, data, format='json')

#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)

#         project_manager = User.objects.get(email='projectmanager@example.com')
#         self.assertTrue(project_manager.groups.filter(name='Project Manager').exists())
#         self.assertTrue(UserCompany.objects.filter(company=self.company, user=project_manager).exists())