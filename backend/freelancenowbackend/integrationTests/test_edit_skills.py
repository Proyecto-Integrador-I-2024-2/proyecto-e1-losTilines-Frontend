from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import unittest
from time import sleep
import random
#LISTO 3 tests
class EditSkillsTest(unittest.TestCase):

    USERNAME = "ricardo.urbina@example.com"
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

    def navigate_to_profile(self):
        driver = self.driver

        profile_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//div[text()='Profile' and @role='button']"))
        )
        profile_button.click()
        sleep(2)

    def scroll_to_element(self, element):
        """Función auxiliar para hacer scrolling hasta un elemento específico."""
        self.driver.execute_script("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", element)

    def test_edit_skill_level(self):
        """Test para editar el nivel de habilidad de un usuario y confirmar la creación en el perfil."""
        self.login()
        self.navigate_to_profile()
        driver = self.driver


        skills_section = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//h6[text()='Skills']/following-sibling::button"))
        )
        self.scroll_to_element(skills_section)
        skills_section.click()
        print("Sección 'Skills' localizada y botón de edición clicado.")


        skill_level_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.NAME, "level"))
        )
        skill_level_input.clear()
        skill_level_input.send_keys("75")
        print("Nivel de habilidad '75' ingresado.")


        select_skill_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "selectSkill"))
        )
        select_skill_button.click()
        print("Menú desplegable de habilidades abierto.")


        skill_options = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.XPATH, "//li[@role='option']"))
        )
        
        selected_skill = random.choice(skill_options)
        self.scroll_to_element(selected_skill)
        skill_name = selected_skill.text.split(" -")[0].strip()
        selected_skill.click()
        print(f"Opción de habilidad seleccionada: {skill_name}")

        save_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "saveChangesButton"))
        )
        save_button.click()
        print("Botón 'Add skill' clicado.")

        skills_container = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'grid-cols-1 sm:grid-cols-2')]"))
        )
        self.scroll_to_element(skills_container)
        print("Scrolling hasta el contenedor de habilidades realizado.")

        skill_name_element = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, f"//div[contains(@class, 'grid-cols-1 sm:grid-cols-2')]//h6[text()='{skill_name}']"))
        )
        self.assertTrue(skill_name_element.is_displayed(), f"La habilidad '{skill_name}' no está visible en el perfil.")
        print(f"Verificación completada: la habilidad '{skill_name}' está presente en el perfil.")

    def get_skill_names(self):
        """Obtener todos los nombres de habilidades actuales en el perfil."""
        driver = self.driver
        skill_elements = driver.find_elements(By.XPATH, "//h6")
        skill_names = [skill.text.strip().lower() for skill in skill_elements]
        return skill_names

    def test_delete_skill_and_compare(self):
        """Test para eliminar una habilidad existente y verificar la diferencia."""
        self.login()
        self.navigate_to_profile()

        initial_skills = self.get_skill_names()
        print(f"Habilidades iniciales en el perfil: {initial_skills}")

        edit_skills_button = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//h6[text()='Skills']/following-sibling::button"))
        )
        edit_skills_button.click()
        print("Sección de edición de habilidades abierta.")

        delete_button = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.ID, "deleteIconButton"))
        )
        delete_button.click()

        save_button = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.ID, "saveChangesButton"))
        )
        save_button.click()
        print("Cambios guardados.")
        sleep(2)

        updated_skills = self.get_skill_names()
        print(f"Habilidades después de la eliminación: {updated_skills}")

        missing_skills = set(initial_skills) - set(updated_skills)
        if missing_skills:
            print(f"Habilidad eliminada: {missing_skills.pop()}")
        else:
            self.fail("No se encontró ninguna diferencia en las habilidades después de la eliminación.")



    def test_edit_skill_from_icon(self):
        """Test para editar el nivel de una habilidad existente en el perfil."""
        self.login()
        self.navigate_to_profile()

        edit_skills_button = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//h6[text()='Skills']/following-sibling::button"))
        )
        edit_skills_button.click()
        sleep(2)
        print("Sección de edición de habilidades abierta.")

        edit_button = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.ID, "editIconButton"))
        )
        edit_button.click()
        print("Botón de edición de habilidad clicado.")

        skill_level_input = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//input[@name='level' and @type='number' and not(@disabled)]"))
        )
        skill_level_input.click()
        skill_level_input.clear()  
        skill_level_input.send_keys("99")
        print("Nivel de habilidad '99' ingresado.")

        save_button = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.ID, "saveChangesButton"))
        )
        save_button.click()
        print("Cambios guardados.")

        sleep(2)

        paragraphs = self.driver.find_elements(By.TAG_NAME, "p")
        paragraph_texts = [p.text for p in paragraphs]

        self.assertIn("99%", paragraph_texts, "El nivel de habilidad '99%' no se encontró en el perfil después de la actualización.")


    def tearDown(self):
        print("Cerrando el navegador...")
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
