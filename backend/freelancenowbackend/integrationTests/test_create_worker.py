from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import unittest
#LISTO, 4 tests DEBE SER EL PRIMERO EN CORRERSE CON EL COMMAND
class CreateWorkerTests(unittest.TestCase):

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

        WebDriverWait(driver, 10).until(EC.alert_is_present())
        alert = driver.switch_to.alert
        self.assertIn("Login successful!", alert.text)
        alert.accept()

    def open_create_worker_form(self):
        """Método para abrir el formulario de creación de trabajador."""
        driver = self.driver

        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//h3[text()='Workers']/following::button[text()='See all'][1]"))
        ).click()
        
        print("Abriendo el formulario de creación de trabajador...")

        WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[text()='Create Worker']"))
        ).click()

    def fill_worker_form(self, first_name, last_name, email, password, role):
        """Método para rellenar el formulario de creación de trabajador."""
        driver = self.driver
        print("Rellenando datos del nuevo trabajador...")

        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "(//input)[1]"))
        ).send_keys(first_name)  # First name

        driver.find_element(By.XPATH, "(//input)[2]").send_keys(first_name)  # Last name
        driver.find_element(By.XPATH, "(//input)[3]").send_keys(last_name)  # Username
        driver.find_element(By.XPATH, "(//input)[4]").send_keys(email)  # Email
        driver.find_element(By.XPATH, "(//input)[5]").send_keys(password)  # Password

        print(f"Seleccionando el rol '{role}'...")
        role_dropdown = driver.find_element(By.XPATH, "//button[@aria-haspopup='listbox' and contains(@class, 'border-red-500')]")
        role_dropdown.click()

        WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, f"//li[text()='{role}']"))
        ).click()

        print("Confirmando creación del trabajador...")
        confirm_button = driver.find_element(By.XPATH, "//button[text()='Confirm']")
        confirm_button.click()

        print("Verificando creación del trabajador en la lista de Workers...")
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, f"//p[text()='{email}']"))
        )
        print(f"Test de creación de {role} completado con éxito")

    def test_create_project_manager(self):
        driver = self.driver
        self.login()
        self.open_create_worker_form()
        
        self.fill_worker_form(
            first_name="Frank",
            last_name="Costello",
            email="frank.costello@example.com",
            password="defaultpassword",
            role="Project Manager"
        )

    def test_create_area_admin_1(self):
        driver = self.driver
        self.login()
        self.open_create_worker_form()
        
        self.fill_worker_form(
            first_name="Luisa",
            last_name="Giraldo",
            email="luisa.giraldo@example.com",
            password="defaultpassword",
            role="Area Admin"
        )

    def test_create_area_admin_2(self):
        driver = self.driver
        self.login()
        self.open_create_worker_form()
        
        self.fill_worker_form(
            first_name="Lu",
            last_name="Gira",
            email="lu.gira@example.com",
            password="defaultpassword",
            role="Area Admin"
        )

    def test_create_area_admin_3(self):
        driver = self.driver
        self.login()
        self.open_create_worker_form()
        
        self.fill_worker_form(
            first_name="isa",
            last_name="aldo",
            email="isa.aldo@example.com",
            password="defaultpassword",
            role="Area Admin"
        )

    def tearDown(self):
        print("Cerrando el navegador...")
        self.driver.quit()




if __name__ == "__main__":
    unittest.main()
