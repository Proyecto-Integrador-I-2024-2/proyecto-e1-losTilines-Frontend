from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from django.contrib.auth.models import Group
from app.models import Area, Company, UserCompany, User
from rest_framework.authtoken.models import Token

class WorkingAreaTests(APITestCase):

    def setUp(self):
        # Crear un Business Manager y su compañía
        self.business_manager = User.objects.create_user(email='manager@example.com', password='password123')
        self.business_manager_group = Group.objects.create(name='Business Manager')
        self.business_manager.groups.add(self.business_manager_group)

        self.company = Company.objects.create(
            tax_id='123456789', name='Test Company', address='123 Main St',
            telephone='+1234567890', email='company@example.com', user=self.business_manager
        )
        UserCompany.objects.create(company=self.company, user=self.business_manager)

        # Crear un Area Admin
        self.area_admin = User.objects.create_user(email='areaadmin@example.com', password='password123')
        self.area_admin_group = Group.objects.create(name='Area Admin')
        self.area_admin.groups.add(self.area_admin_group)

        # Autenticar el Business Manager
        self.token = Token.objects.create(user=self.business_manager)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_list_areas(self):
        # Crear un área de trabajo asociada a la compañía del Business Manager
        Area.objects.create(name='Test Area', company=self.company, user=self.area_admin)

        # Probar la vista de listar áreas de trabajo
        url = reverse('working-area-list')  # Nombre de la URL de la vista
        response = self.client.get(url)

        # Verificar que se devuelva un status 200 y se liste el área de trabajo
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Test Area')

    def test_create_area(self):
        # Probar la vista de creación de un área de trabajo
        url = reverse('working-area-create')
        data = {
            'name': 'New Area',
            'company': self.company.id,
            'user': self.area_admin.id
        }
        response = self.client.post(url, data)

        # Verificar que el área de trabajo se haya creado correctamente
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Area.objects.count(), 1)
        area = Area.objects.first()
        self.assertEqual(area.name, 'New Area')
        self.assertEqual(area.company, self.company)
        self.assertEqual(area.user, self.area_admin)

    def test_update_area(self):
        # Crear un área de trabajo
        area = Area.objects.create(name='Old Area', company=self.company, user=self.area_admin)

        # Probar la actualización del área
        url = reverse('working-area-update', kwargs={'pk': area.id})
        data = {
            'name': 'Updated Area',
            'company': self.company.id,
            'user': self.area_admin.id
        }
        response = self.client.put(url, data)

        # Verificar que el área de trabajo se haya actualizado correctamente
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        area.refresh_from_db()
        self.assertEqual(area.name, 'Updated Area')
        self.assertEqual(area.company, self.company)
        self.assertEqual(area.user, self.area_admin)

    def test_delete_area(self):
        # Crear un área de trabajo
        area = Area.objects.create(name='Test Area', company=self.company, user=self.area_admin)

        # Probar la eliminación del área
        url = reverse('working-area-delete', kwargs={'pk': area.id})
        response = self.client.delete(url)

        # Verificar que el área de trabajo se haya eliminado correctamente
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Area.objects.count(), 0)

    def test_list_company_workers(self):
        # Probar la vista que lista los trabajadores de la compañía
        url = reverse('workers-list', kwargs={'company_id': self.company.id})
        response = self.client.get(url)

        # Verificar que la lista de trabajadores se devuelve correctamente
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # El Area Admin debe estar en la lista
        self.assertEqual(response.data[0]['email'], self.area_admin.email)
from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from django.contrib.auth.models import Group
from app.models import Area, Company, UserCompany, User
from rest_framework.authtoken.models import Token

class WorkingAreaTests(APITestCase):

    def setUp(self):
        # Crear un Business Manager y su compañía
        self.business_manager = User.objects.create_user(email='manager@example.com', password='password123')
        self.business_manager_group = Group.objects.create(name='Business Manager')
        self.business_manager.groups.add(self.business_manager_group)

        self.company = Company.objects.create(
            tax_id='123456789', name='Test Company', address='123 Main St',
            telephone='+1234567890', email='company@example.com', user=self.business_manager
        )
        UserCompany.objects.create(company=self.company, user=self.business_manager)

        # Crear un Area Admin
        self.area_admin = User.objects.create_user(email='areaadmin@example.com', password='password123')
        self.area_admin_group = Group.objects.create(name='Area Admin')
        self.area_admin.groups.add(self.area_admin_group)

        # Autenticar el Business Manager
        self.token = Token.objects.create(user=self.business_manager)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_list_areas(self):
        # Crear un área de trabajo asociada a la compañía del Business Manager
        area = Area.objects.create(name='Test Area', company=self.company, user=self.area_admin)

        # Probar la vista de listar áreas de trabajo
        url = reverse('working-area-list')  # Nombre de la URL de la vista
        response = self.client.get(url)

        # Verificar que se devuelva un status 200 y se liste el área de trabajo
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], area.name)  

    def test_create_area(self):
        # Probar la vista de creación de un área de trabajo
        url = reverse('working-area-create')
        data = {
            'name': 'New Area',
            'company': self.company.id,
            'user': self.area_admin.id
        }
        response = self.client.post(url, data)

        # Verificar que el área de trabajo se haya creado correctamente
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Area.objects.count(), 1)
        area = Area.objects.first()
        self.assertEqual(area.name, 'New Area')
        self.assertEqual(area.company, self.company)
        self.assertEqual(area.user, self.area_admin)

    def test_update_area(self):
        # Crear un área de trabajo
        area = Area.objects.create(name='Old Area', company=self.company, user=self.area_admin)

        # Probar la actualización del área
        url = reverse('working-area-update', kwargs={'pk': area.id})
        data = {
            'name': 'Updated Area',
            'company': self.company.id,
            'user': self.area_admin.id
        }
        response = self.client.put(url, data)

        # Verificar que el área de trabajo se haya actualizado correctamente
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        area.refresh_from_db()
        self.assertEqual(area.name, 'Updated Area')
        self.assertEqual(area.company, self.company)
        self.assertEqual(area.user, self.area_admin)

    def test_delete_area(self):
        # Crear un área de trabajo
        area = Area.objects.create(name='Test Area', company=self.company, user=self.area_admin)

        # Probar la eliminación del área
        url = reverse('working-area-delete', kwargs={'pk': area.id})
        response = self.client.delete(url)

        # Verificar que el área de trabajo se haya eliminado correctamente
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Area.objects.count(), 0)