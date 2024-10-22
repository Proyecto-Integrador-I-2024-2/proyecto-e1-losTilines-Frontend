# from django.test import TestCase
# from django.contrib.auth.models import User, Group
# from django.urls import reverse  # Importamos reverse para usar los nombres de las URLs
# from rest_framework.test import APIClient
# from rest_framework import status
# from app.models import Area, Company, UserCompany
# from rest_framework.test import APITestCase
# from django.contrib.auth import get_user_model

# User = get_user_model()

# class RegisterAreaAdminViewTest(APITestCase):

#     def setUp(self):
#         # Crear grupos
#         self.business_manager_group = Group.objects.create(name='Business Manager')
#         self.admin_area_group = Group.objects.create(name='Admin Area')

#         # Crear usuarios
#         self.business_manager_user = User.objects.create_user(email='manager@gmail.com', password='password123')
#         self.business_manager_user.groups.add(self.business_manager_group)
        
#         self.admin_area_user = User.objects.create_user(email='admin_area@gmail.com', password='password123')
#         self.admin_area_user.groups.add(self.admin_area_group)
        
        
#         # Crear empresa
#         self.company = Company.objects.create(name="Test Company", user = self.business_manager_user)
        
        
#         # Asociar Business Manager con la empresa
#         self.user_company = UserCompany.objects.create(user=self.business_manager_user, company=self.company)
        
#         # Configurar cliente de API
#         self.client = APIClient()

#     def test_create_area_as_business_manager(self):
#         # Autenticamos como el Business Manager
#         self.client.force_authenticate(user=self.business_manager_user)
        
#         # Usamos reverse para obtener la URL del endpoint
#         url = reverse('areas-list')

#         # Intentamos crear un área con el Business Manager
#         response = self.client.post(url, {
#             'name': 'Area 1',
#             'user': self.admin_area_user.id,  # Este usuario es de Admin Area
#             'company': self.business_manager_user.company
#         })

#         # Comprobar que la respuesta es exitosa (201)
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)

#         # Verificar que el área fue creada
#         area = Area.objects.get(name='Area 1')
#         self.assertEqual(area.company, self.company)  # La compañía del área debe ser la misma que la del manager
#         self.assertEqual(area.user, self.admin_area_user)  # El usuario debe ser del grupo Admin Area
    
#     def test_create_area_fails_for_non_business_manager(self):
#         # Crear otro usuario que no es Business Manager
#         regular_user = User.objects.create_user(email='regular_user@gmail.com', password='password123')
        
#         # Autenticamos como un usuario sin el rol de Business Manager
#         self.client.force_authenticate(user=regular_user)

#         # Usamos reverse para obtener la URL del endpoint
#         url = reverse('areas-list')

#         # Intentamos crear un área
#         response = self.client.post(url, {
#             'name': 'Area 2',
#             'user': self.admin_area_user.id
#         })

#         # Comprobar que la respuesta es un error de autorización (403)
#         self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

#     def test_create_area_fails_for_invalid_user(self):
#         # Autenticamos como el Business Manager
#         self.client.force_authenticate(user=self.business_manager_user)
        
#         # Crear un usuario que no es parte del grupo Admin Area
#         regular_user = User.objects.create_user(email='regular_user@gmail.com', password='password123')

#         # Usamos reverse para obtener la URL del endpoint
#         url = reverse('areas-list')

#         # Intentamos crear un área asignando este usuario que no pertenece al grupo Admin Area
#         response = self.client.post(url, {
#             'name': 'Area 3',
#             'user': regular_user.id,  # Este usuario no es de Admin Area
#             'company': self.company
#         })

#         # Comprobar que la respuesta es un error de validación (400)
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


#     def test_company_listing(self):

#         url = reverse('company-list')
#         response = self.client.get(url)

#         self.assertEqual(response.status_code, status.HTTP_200_OK)