from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import unittest
from time import sleep
#FALLAN LOS 2 tests
#Esperar boton de Add Experience para terminar el segundo test
class EditWorkExperienceTests(unittest.TestCase):

    USERNAME = "ricardo.urbina@example.com"
    PASSWORD = "123"

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.get("http://localhost:29002/auth/sign-in")

    def adjust_zoom(self, zoom_level=0.7):
        """Ajusta el zoom de la página."""
        self.driver.execute_script(f"document.body.style.zoom='{zoom_level}'")
        print(f"Zoom ajustado al {int(zoom_level * 100)}%")

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

    def navigate_to_profile(self):
        driver = self.driver
        profile_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//div[text()='Profile' and @role='button']"))
        )
        profile_button.click()
        sleep(2)

    def navigate_to_work_experience(self):
        driver = self.driver
        work_experience_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//div[h6[text()='Work Experience']]/button"))
        )
        work_experience_button.click()
        sleep(2)

    def edit_first_work_experience(self, new_occupation):
        driver = self.driver

        # Seleccionar el primer botón de edición
        edit_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "editIconButton"))
        )
        edit_button.click()
        print("Botón de edición (edit icon) clicado.")

        # Rellenar el campo de ocupación
        occupation_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "occupation"))
        )
        occupation_input.clear()
        occupation_input.send_keys(new_occupation)

        # Ajustar el zoom al 70% antes de hacer clic en "Save Changes"
        self.adjust_zoom(0.7)

        # Hacer clic en el botón de guardar cambios
        save_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "addOrSave"))
        )
        save_button.click()
        print("Botón 'Save Changes' clicado.")

    def test_edit_work_experience(self):
        """Test para editar la ocupación de una experiencia laboral existente."""
        self.login()
        self.navigate_to_profile()
        self.navigate_to_work_experience()

        new_occupation = "Neurocirujano de Mosquitos"

        self.edit_first_work_experience(new_occupation)

        # Verificar que el nuevo título de ocupación esté presente en la lista
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, f"//h5[text()='{new_occupation}']"))
        )
        print("Test de edición de experiencia laboral completado con éxito.")


    def fill_work_experience_form(self, occupation, start_date, final_date, description):
        driver = self.driver

        # Rellenar el campo de ocupación
        occupation_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "occupation"))
        )
        occupation_input.clear()
        occupation_input.send_keys(occupation)

        # Rellenar la fecha de inicio
        start_date_input = driver.find_element(By.ID, "startDate")
        start_date_input.clear()
        start_date_input.send_keys(start_date)

        # Rellenar la fecha de finalización
        final_date_input = driver.find_element(By.ID, "finalDate")
        final_date_input.clear()
        final_date_input.send_keys(final_date)

        # Rellenar la descripción
        description_input = driver.find_element(By.ID, "description")
        description_input.clear()
        description_input.send_keys(description)

        print("Formulario de experiencia laboral rellenado.")

    def test_add_work_experience(self):
        """Test para agregar una nueva experiencia laboral."""
        self.login()
        self.navigate_to_profile()
        self.navigate_to_work_experience()

        # Datos de experiencia laboral
        occupation = "Software Engineer"
        start_date = "01/01/2020"  # Formato dd/mm/aaaa
        final_date = "31/12/2022"  # Formato dd/mm/aaaa
        description = "Desarrollo de aplicaciones y sistemas complejos."

        self.fill_work_experience_form(occupation, start_date, final_date, description)

        self.adjust_zoom(0.7)

        # Intentar guardar la experiencia
        save_button = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.ID, "addOrSave"))
        )
        save_button.click()
        print("Botón 'Add Experience' clicado, pero sin verificar persistencia.")

        # Esperar unos segundos para simular cierre del formulario
        sleep(2)
        print("Formulario de experiencia laboral cerrado.")

    def tearDown(self):
        print("Cerrando el navegador...")
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
