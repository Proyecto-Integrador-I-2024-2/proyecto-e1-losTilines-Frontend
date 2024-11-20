from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import unittest

#1
class MilestoneCRUDTest(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.get("http://localhost:29002/auth/sign-in")

    def login(self):
        """Inicia sesión como Ricardo Urbina."""
        driver = self.driver
        print("Iniciando sesión con Ricardo Urbina...")

        email_field = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "emailSign"))
        )
        email_field.send_keys("ricardo.urbina@example.com")

        password_field = driver.find_element(By.ID, "passwordSign")
        password_field.send_keys("123")

        terms_checkbox = driver.find_element(By.ID, "termsAndConditions")
        terms_checkbox.click()

        login_button = driver.find_element(By.ID, "entrar")
        login_button.click()

        WebDriverWait(driver, 10).until(EC.alert_is_present())
        alert = driver.switch_to.alert
        self.assertIn("Login successful!", alert.text)
        alert.accept()
        print("Inicio de sesión exitoso.")

    def navigate_to_project_details(self):
        """Navega al proyecto 'Freelance Aplication' y entra a 'Details'."""
        driver = self.driver

        # Navegar a la pantalla de Projects
        projects_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//div[text()='Projects' and @role='button']"))
        )
        projects_button.click()

        # Localizar el botón Details correspondiente al proyecto 'Freelance Aplication'
        project_card = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//p[text()='Freelance Aplication']/ancestor::div[contains(@class, 'relative')]//button[@id='details']"))
        )
        project_card.click()
        print("Navegando al proyecto 'Freelance Aplication'.")


    def navigate_to_milestones(self):
        """Navega a la pestaña 'Milestones'."""
        driver = self.driver

        milestones_tab = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "milestones"))
        )
        milestones_tab.click()
        print("Entrando a la pestaña 'Milestones'.")

    def create_milestone(self):
        """Crea un nuevo milestone."""
        driver = self.driver

        # Hacer clic en 'Propose Milestone'
        propose_milestone_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "proposeMilestone"))
        )
        propose_milestone_button.click()
        print("Botón 'Propose Milestone' clicado.")

        # Llenar el formulario del milestone
        milestone_name = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "newMilestoneName"))
        )
        milestone_name.send_keys("Testing Milestones")

        milestone_description = driver.find_element(By.ID, "newMilestoneDescription")
        milestone_description.send_keys("Este es un test para crear un nuevo milestone y validarlo.")

        # Confirmar la creación del milestone
        confirm_button = driver.find_element(By.ID, "confirm")
        confirm_button.click()
        print("Milestone propuesto y confirmado.")

    def validate_milestone_creation(self):
        """Valida que el milestone fue creado correctamente."""
        driver = self.driver

        # Verificar que el texto del milestone existe en algún <p>
        milestone_title = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//p[contains(text(), 'Testing Milestones')]"))
        )
        self.assertIsNotNone(milestone_title, "El título del milestone no fue encontrado.")
        print("Milestone encontrado y validado con éxito.")

    def test_create_and_validate_milestone(self):
        """Test completo para crear y validar un milestone."""
        self.login()
        self.navigate_to_project_details()
        self.navigate_to_milestones()
        self.create_milestone()
        self.validate_milestone_creation()

    def tearDown(self):
        print("Cerrando el navegador...")
        self.driver.quit()


if __name__ == "__main__":
    unittest.main()
