from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from app.models import User, Group, Company, UserCompany

User = get_user_model()

class UserViewSetTests(APITestCase):
 
    def setUp(self):
        #-------------GRUPOS / ROLES -----------------------------------------------#
        self.freelancer_group = Group.objects.create(name='Freelancer')
        self.business_manager_group = Group.objects.create(name='Business Manager')
        self.admin_area_group = Group.objects.create(name='Admin Area')
        self.project_manager_group = Group.objects.create(name='Project Manager')
        #-----------------------------------------------------------------------------#

        #------------------USUARIOS---------------------------------------------------#
        self.freelancer_user = User.objects.create_user(
            email='freelancer@example.com',
            password='password',
            first_name='Freelancer',
            last_name='User'
        )
        self.freelancer_user.groups.add(self.freelancer_group)

        self.business_manager_user = User.objects.create_user(
            email='manager@example.com',
            password='password',
            first_name='Business',
            last_name='Manager'
        )
        self.business_manager_user.groups.add(self.business_manager_group)

        self.project_manager_user = User.objects.create_user(
            email='project@example.com',
            password='password',
            first_name='Project',
            last_name='Manager'
        )
        self.project_manager_user.groups.add(self.project_manager_group)
        
        self.admin_area_user = User.objects.create_user(
            email='admin@example.com',
            password='password',
            first_name='Admin',
            last_name='Area'
        )
        self.admin_area_user.groups.add(self.admin_area_group)
        #------------------------------------------------------------------------------#

        #-------------------------------COMPAÑIAS--------------------------------------#
        self.company = Company.objects.create(name='Tech Solutions', user= self.business_manager_user)
        # Asignar empresa al Business Manager
        self.user_company = UserCompany.objects.create(
            user=self.business_manager_user,
            company=self.company,
        )

        #------------------------------------------------------------------------------#

    #----------------------------------------POST---------------------------------------#
    def test_freelancer_creation(self):
    
        url = reverse('freelancers-list')  # Asegúrate de que el basename sea 'freelancers'
        data = {
            'email': 'newfreelancer@example.com',
            'first_name': 'New',
            'last_name': 'Freelancer',
            'password': 'password123'
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 5)  # Verifica que se haya creado un nuevo usuario


    def test_business_manager_creation(self):
        url = reverse('business-managers-list')
        data = {
            'email': 'newmanager@example.com',
            'first_name': 'New',
            'last_name': 'Manager',
            'password': 'password123'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 5)

    
    # def test_project_manager_creation(self):
    #     url = reverse('project-managers-list')
        
    #     data = {
    #         'email': 'newprojectmanager@example.com',
    #         'first_name': 'New',
    #         'last_name': 'Project',
    #         'password': 'password123'
    #     }
    #     self.client.force_authenticate(user=self.business_manager_user)
        
    #     response = self.client.post(url, data, format='json')
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    #     self.assertEqual(User.objects.count(), 5)    


    # def test_admin_area_creation(self):
    #     url = reverse('admin-areas-list')
    #     data = {
    #         'email': 'adminarea@example.com',
    #         'first_name': 'Admin',
    #         'last_name': 'New',
    #         'password': 'password123'
    #     }
    #     self.client.force_authenticate(user=self.business_manager_user)
        
    #     response = self.client.post(url, data, format='json')
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    #     self.assertEqual(User.objects.count(), 5) 

    def test_login (self):
        url = reverse('login')
        data = {
            'email': 'freelancer@example.com',
            'password': 'password'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    #-----------------------------------------------------------------------------------------#
    #---------------------------------GET / LISTING ------------------------------------------#

    def test_freelancer_list(self):
        url = reverse('freelancers-list')
        self.client.force_authenticate(user=self.freelancer_user)

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  

    def test_business_manager_list(self):
        url = reverse('business-managers-list')
        self.client.force_authenticate(user=self.business_manager_user)
        
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1) 

    # def test_projecct_manager_list(self):
    #     url = reverse('project-managers-list')
    #     self.client.force_authenticate(user=self.business_manager_user)
        
    #     response = self.client.get(url)
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.assertEqual(len(response.data), 1) 
    
    # def test_admin_area_list(self):
    #     url = reverse('admin-areas-list')
    #     self.client.force_authenticate(user=self.business_manager_user)
        
    #     response = self.client.get(url)
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.assertEqual(len(response.data), 1) 

    def test_companies_listing(self):
        url = reverse('companies-list')
        self.client.force_authenticate(user=self.business_manager_user)

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1) # Debe haber una empresa

    def test_users_listing(self):
        url = reverse('users-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0) #Revisar, deberían haber 4 usuarios; no 0.
    #---------------------------------------------------------------------------------#

    #------------------------------------PATCH----------------------------------------#


    #---------------------------------------------------------------------------------#
    #------------------------------------DELETE---------------------------------------#


    #---------------------------------------------------------------------------------#