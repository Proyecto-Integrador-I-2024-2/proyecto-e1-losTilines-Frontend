from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import unittest
from time import sleep

class ReadProjectsTests(unittest.TestCase):
    USERNAME = "sara.diaz@example.com"
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

    def navigate_to_projects(self):
        driver = self.driver

        projects_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//div[text()='Projects' and @role='button']"))
        )
        projects_button.click()
        print("en projects")

    def validate_project_card(self):
        driver = self.driver

        details_button = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.ID, "details"))
        )

        details_button.click()
        sleep(1)


    def validate_project_details(self):
        driver = self.driver

        project_tab = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//li[@role='tab' and @data-value='details']"))
        )
        self.assertIsNotNone(project_tab, "No se encontró la pestaña 'Project Detail'.")

        milestones_tab = driver.find_element(By.XPATH, "//li[@role='tab' and @data-value='milestones']")
        self.assertIsNotNone(milestones_tab, "No se encontró la pestaña 'Milestones'.")

        options_button = driver.find_element(By.XPATH, "//button[@aria-haspopup='menu']")
        self.assertIsNotNone(options_button, "No se encontró el botón de opciones.")

        skills_needed_header = driver.find_element(By.XPATH, "//h5[text()=' Skills needed ']")
        self.assertIsNotNone(skills_needed_header, "No se encontró el encabezado 'Skills needed'.")

    def test_read_projects(self):

        self.login()
        self.navigate_to_projects()
        self.validate_project_card()
        self.validate_project_details()
        print("Test de lectura de proyectos completado con éxito.")


    def update_project(self):
        driver = self.driver

        details_button = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.ID, "details"))
        )
        details_button.click()
        sleep(1)

        edit_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "3puntos"))
        )
        edit_button.click()

        to_Pop_Up = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "editProjectButton"))
        )
        to_Pop_Up.click()

        name_field = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "nameProject"))
        )
        name_field.clear()
        name_field.send_keys("Nombre editado")

        budget_field = driver.find_element(By.ID, "budget")
        budget_field.clear()
        budget_field.send_keys("99")

        description_field = driver.find_element(By.ID, "description")
        description_field.clear()
        description_field.send_keys("Esta es una nueva descripcion para un proyecto ya existente que ha sido editado")

        save_button = driver.find_element(By.ID, "saveChangesButton")
        save_button.click()
        print("Se han guardado los cambios en el proyecto.")

    def validate_updated_project(self):
        driver = self.driver

        project_name = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//h4[text()='Nombre editado']"))
        )
        self.assertIsNotNone(project_name, "El nombre del proyecto no se actualizó correctamente.")

        project_description = driver.find_element(By.XPATH, "//p[text()='Esta es una nueva descripcion para un proyecto ya existente que ha sido editado']")
        self.assertIsNotNone(project_description, "La descripción del proyecto no se actualizó correctamente.")

        project_budget = driver.find_element(By.XPATH, "//h6[strong[text()='99.00']]")
        self.assertIsNotNone(project_budget, "El presupuesto del proyecto no se actualizó correctamente.")

    def test_update_project(self):
        """Test para actualizar un proyecto y validar los cambios."""
        self.login()
        self.navigate_to_projects()
        self.update_project()
        self.validate_updated_project()
        print("Test de actualización de proyecto completado con éxito.")

    
    def update_skills_project(self):
        driver = self.driver

        details_button = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.ID, "details"))
        )
        details_button.click()
        sleep(1)

        edit_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "3puntos"))
        )
        edit_button.click()

        to_Pop_Up = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "editSkillsButton"))
        )
        to_Pop_Up.click()

        edit_Icon = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "editIconButton"))
        )
        edit_Icon.click()
    
        skill_level_input = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//input[@name='level' and @type='number' and not(@disabled)]"))
        )
        skill_level_input.click()
        skill_level_input.clear()  
        skill_level_input.send_keys("99")
        print("Nivel de habilidad '99' ingresado.")
        sleep(2)

        save_button = driver.find_element(By.ID, "saveChangesButton")
        save_button.click()
        print("Se han guardado los cambios en el proyecto.")

    def validate_updated_skill_project(self):
        driver = self.driver

        skill_Level = driver.find_element(By.XPATH, "//p[contains(text(), '99')]")
        self.assertIsNotNone(skill_Level, "El nivel de habilidad no se actualizó correctamente.")


    def test_updated_skills_level(self):
        self.login()
        self.navigate_to_projects()
        self.update_skills_project()
        #self.validate_updated_skill_project()

    def tearDown(self):
        print("Cerrando el navegador...")
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
