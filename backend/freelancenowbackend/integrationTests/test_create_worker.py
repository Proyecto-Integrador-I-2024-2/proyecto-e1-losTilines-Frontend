from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import unittest

class CreateWorkerTests(unittest.TestCase):
    USERNAME = "patricia.agudelo@example.com"
    PASSWORD = "123"

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.get("http://localhost:29002/auth/sign-in")

    def login(self):
        """Método para iniciar sesión en la plataforma."""
        driver = self.driver
        print("Navegando a la página de inicio de sesión...")

        # Ingresar credenciales
        email_field = driver.find_element(By.XPATH, "//input[@placeholder='name@mail.com']")
        email_field.send_keys(self.USERNAME)

        password_field = driver.find_element(By.XPATH, "//input[@placeholder='********']")
        password_field.send_keys(self.PASSWORD)

        terms_checkbox = driver.find_element(By.XPATH, "//input[@type='checkbox']")
        terms_checkbox.click()

        login_button = driver.find_element(By.XPATH, "//button[text()='Entrar']")
        login_button.click()

        # Verificar alerta de inicio de sesión exitoso
        WebDriverWait(driver, 10).until(EC.alert_is_present())
        alert = driver.switch_to.alert
        self.assertIn("Login successful!", alert.text)
        alert.accept()
        print("Redirigiendo al dashboard...")

    def open_create_worker_form(self):
        """Método para abrir el formulario de creación de trabajador."""
        driver = self.driver
        # Navegar a la sección de trabajadores
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//h3[text()='Workers']/following::button[text()='See all'][1]"))
        ).click()
        
        print("Abriendo el formulario de creación de trabajador...")

        # Abrir el formulario de creación de trabajador
        WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[text()='Create Worker']"))
        ).click()

    def fill_worker_form(self, first_name, last_name, username, email, password, area, role):
        """Método para rellenar el formulario de creación de trabajador."""
        driver = self.driver
        print("Rellenando datos del nuevo trabajador...")

        # Rellenar los datos del trabajador
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "(//input)[1]"))
        ).send_keys(first_name)  # First name

        driver.find_element(By.XPATH, "(//input)[2]").send_keys(last_name)  # Last name
        driver.find_element(By.XPATH, "(//input)[3]").send_keys(username)  # Username
        driver.find_element(By.XPATH, "(//input)[4]").send_keys(email)  # Email
        driver.find_element(By.XPATH, "(//input)[5]").send_keys(password)  # Password

        # Seleccionar el área
        print(f"Seleccionando el área '{area}'...")
        area_dropdown = driver.find_element(By.XPATH, "//button[@aria-haspopup='listbox' and contains(@class, 'border-blue-gray-200')]")
        area_dropdown.click()

        WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, f"//li[text()='{area}']"))
        ).click()

        # Seleccionar el rol
        print(f"Seleccionando el rol '{role}'...")
        role_dropdown = driver.find_element(By.XPATH, "//button[@aria-haspopup='listbox' and contains(@class, 'border-red-500')]")
        role_dropdown.click()

        WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, f"//li[text()='{role}']"))
        ).click()

        # Confirmar la creación del trabajador
        print("Confirmando creación del trabajador...")
        confirm_button = driver.find_element(By.XPATH, "//button[text()='Confirm']")
        confirm_button.click()

        # Verificar que el nuevo trabajador aparece en la lista con el correo especificado
        print("Verificando creación del trabajador en la lista de Workers...")
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, f"//p[text()='{email}']"))
        )
        print(f"Test de creación de {role} completado con éxito")

    def test_create_project_manager(self):
        driver = self.driver
        self.login()
        self.open_create_worker_form()
        
        # Llenar el formulario para un Project Manager
        self.fill_worker_form(
            first_name="Pilar",
            last_name="Duque",
            username="pilar.duque",
            email="pilar.duque@example.com",
            password="defaultpassword",
            area="Marketing",
            role="Project Manager"
        )

    def test_create_area_admin(self):
        driver = self.driver
        self.login()
        self.open_create_worker_form()
        
        # Llenar el formulario para un Area Admin
        self.fill_worker_form(
            first_name="Luis",
            last_name="Martinez",
            username="luis.martinez",
            email="luis.martinez@example.com",
            password="defaultpassword",
            area="Ventas",
            role="Area Admin"
        )

    def tearDown(self):
        print("Cerrando el navegador...")
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
