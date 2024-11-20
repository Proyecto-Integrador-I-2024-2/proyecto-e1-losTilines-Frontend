from selenium import webdriver
from time import sleep
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import unittest

#LISTO 4 test
class CreateAreaTests(unittest.TestCase):

    USERNAME = "raul.quigua@example.com"
    PASSWORD = "123"

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.get("http://localhost:29002/auth/sign-in")

    def login(self):
        driver = self.driver
        print("Navegando a la página de inicio de sesión...")

        email_field = driver.find_element(By.ID, "emailSign")
        email_field.send_keys(self.USERNAME)

        password_field = driver.find_element(By.ID, "passwordSign")
        password_field.send_keys(self.PASSWORD)

        terms_checkbox = driver.find_element(By.ID, "termsAndConditions")
        terms_checkbox.click()

        login_button = driver.find_element(By.ID, "entrar")
        login_button.click()

        # Verificar alerta de éxito
        WebDriverWait(driver, 10).until(EC.alert_is_present())
        alert = driver.switch_to.alert
        self.assertIn("Login successful!", alert.text)
        alert.accept()

    def open_create_area_form_from_dashboard(self):
        """Método para abrir el formulario de creación de área desde el dashboard."""
        driver = self.driver
        print("Navegando a la sección de áreas desde el dashboard...")
        
        WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[text()='New area']"))
        ).click()
        
        print("Formulario de creación de área abierto.")

    def fill_area_form(self, area_name):
        """Método para rellenar el formulario de creación de área."""
        driver = self.driver
        print(f"Rellenando datos del área '{area_name}'...")

        area_name_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "area-name-input"))  # Usamos el id en lugar de XPATH
        )
        area_name_input.send_keys(area_name)
        sleep(2)

        admin_checkbox = driver.find_element(By.XPATH, "//input[@type='checkbox']")
        admin_checkbox.click()
        sleep(2)

        confirm_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "confirm"))
        )
        confirm_button.click()
        print(f"Área '{area_name}' creada con éxito.")


    def test_create_area_from_dashboard(self):
        """Test para crear un área y asignar un Admin de Área desde el dashboard."""
        self.login()
        self.open_create_area_form_from_dashboard()

        area_name_1 = "Alimentación"
        
        self.fill_area_form(area_name_1)

        print("Verificando que el área 'Alimentación' fue creada correctamente...")
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//p[text()='Alimentación']"))
        )
        print("Test de creación de área desde el dashboard completado con éxito.")

    def test_cancel_create_area(self):

        self.login()
        self.open_create_area_form_from_dashboard()

        driver = self.driver
        area_name = "ContactService"

        area_name_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "area-name-input"))
        )
        area_name_input.send_keys(area_name)

        close_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "close"))
        )
        close_button.click()
        print("Operación de creación de área cancelada.")

        print("Verificando que el área 'ContactService' no fue creada...")
        elements = driver.find_elements(By.XPATH, "//h5[text()='ContactService']")
        self.assertEqual(len(elements), 0, "El área 'ContactService' fue encontrada, pero no debería existir.")
        print("Verificación completada: el área 'ContactService' no fue creada.")

    def test_create_area_with_empty_name(self):

        self.login()
        self.open_create_area_form_from_dashboard()

        driver = self.driver

        confirm_button = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "confirm"))
        )
        self.assertTrue(confirm_button.get_attribute("disabled"), "El botón 'Confirm' debería estar deshabilitado cuando el nombre del área está vacío.")

        elements = driver.find_elements(By.XPATH, "//h5[text()='']")
        self.assertEqual(len(elements), 0, "No se debería crear ninguna área sin nombre.")

        print("Verificación completada: no se puede crear un área sin nombre y el botón 'Confirm' está deshabilitado.")


    def test_create_area_with_long_name(self):

        self.login()
        self.open_create_area_form_from_dashboard()

        driver = self.driver
        long_area_name = "ThisIsAVeryLongAreaName!"  # 21 caracteres

        self.fill_area_form(long_area_name)

        print("Intentando crear un área con un nombre de más de 20 caracteres.")

        print(f"Verificando que el área '{long_area_name}' no fue creada...")
        elements = driver.find_elements(By.XPATH, f"//h5[text()='{long_area_name}']")
        self.assertEqual(len(elements), 0, f"El área '{long_area_name}' fue encontrada, pero no debería existir.")
        print("Verificación completada: el área con un nombre de más de 20 caracteres no fue creada.")


    def tearDown(self):
        print("Cerrando el navegador...")
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
