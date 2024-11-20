from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import unittest
from time import sleep
#1
class EditMilestoneTest(unittest.TestCase):
    USERNAME = "sara.diaz@example.com"
    PASSWORD = "123"

    def login_as_Freelancer(self):
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

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.get("http://localhost:29002/auth/sign-in")

    def login(self):
        driver = self.driver
        print("Navegando a la página de inicio de sesión...")


        # Intentar encontrar el botón de logout
        logout_button = WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.ID, "logInOutButton"))
        )
        logout_button.click()
        print("Sesión activa detectada. Cerrando sesión...")

        # Esperar a que la página redirija a la página principal
        WebDriverWait(driver, 10).until(
            EC.url_to_be("http://localhost:29002/")
        )

        # Hacer clic en el botón 'Log in'
        login_redirect_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "logInOutButton"))
        )
        login_redirect_button.click()
        print("Redirigiendo a la pantalla de inicio de sesión...")
        
        # Esperar a que la página redirija a la pantalla de inicio de sesión
        WebDriverWait(driver, 10).until(
            EC.url_to_be("http://localhost:29002/auth/sign-in")
        )

        # Rellenar el formulario de inicio de sesión
        email_field = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "emailSign"))
        )
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
        print("Inicio de sesión exitoso.")

        print("Inicio de sesión exitoso.")

    def edit_milestone(self):
        driver = self.driver

        # Seleccionar el milestone "Testing Milestones"
        milestone = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//p[text()='Testing Milestones']"))
        )
        milestone.click()
        print("Milestone 'Testing Milestones' seleccionado.")

        # Hacer clic en el botón de editar
        edit_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "milestonEditButton"))
        )
        edit_button.click()
        print("Botón de editar clicado.")

        # Cambiar el nombre del milestone
        name_field = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "newNameMilestone"))
        )
        name_field.clear()
        name_field.send_keys("Testing edit Milestone")
        print("Nombre del milestone actualizado.")

        # Reducir el zoom de la página para ver el botón de confirmación
        driver.execute_script("document.body.style.zoom='80%'")
        print("Zoom reducido al 80%.")

        # Cambiar la descripción
        description_field = driver.find_element(By.ID, "newDescriptionMilestone")
        description_field.clear()
        description_field.send_keys("Este es un test para validar la edición de un milestone existente.")
        print("Descripción del milestone actualizada.")

        # Cambiar el estado a "Done"
        status_dropdown = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[@aria-haspopup='listbox']"))
        )
        status_dropdown.click()

        done_option = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//li[text()='Done']"))
        )
        done_option.click()
        print("Estado cambiado a 'Done'.")

        # Guardar cambios
        save_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "confirm"))
        )
        save_button.click()
        print("Cambios guardados.")

        # Restaurar el zoom original
        driver.execute_script("document.body.style.zoom='100%'")
        print("Zoom restaurado al 100%.")
        sleep(2)


    def validate_updated_milestone(self):
        driver = self.driver

        # Verificar que el nuevo nombre existe en un elemento <h4>
        milestone_name = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//h4[text()='Testing edit Milestone']"))
        )
        self.assertIsNotNone(milestone_name, "El nombre del milestone no se actualizó correctamente.")
        print("Nombre del milestone verificado.")

        # Verificar que el estado 'Done' está presente
        milestone_status = driver.find_element(By.XPATH, "//div[contains(@class, 'bg-green-500')]/span[text()='done']")
        self.assertIsNotNone(milestone_status, "El estado del milestone no se actualizó correctamente.")
        print("Estado 'Done' del milestone verificado.")


    
    def delete_milestone(self):
        driver = self.driver

        # Crear una lista con todos los textos en los elementos <p> antes de eliminar
        initial_milestone_texts = [
            p.text.strip() for p in driver.find_elements(By.TAG_NAME, "p")
        ]
        print(f"Lista de milestones antes de eliminar: {initial_milestone_texts}")

        # Seleccionar el milestone "Testing Milestones"
        milestone = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//p[text()='Testing edit Milestone']"))
        )
        milestone.click()
        print("Milestone 'Testing Milestones' seleccionado.")

        # Hacer clic en el botón de editar
        edit_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "milestonEditButton"))
        )
        edit_button.click()
        print("Botón de editar clicado.")

        # Hacer clic en el botón de eliminar (trash icon)
        delete_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "trasButton"))
        )
        delete_button.click()
        print("Botón de eliminar clicado.")

        # Esperar a que aparezca el pop-up y confirmar la eliminación
        confirm_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[@id='confirm']"))
        )
        confirm_button.click()
        print("Confirmación de eliminación realizada.")

        # Esperar un momento para asegurarse de que el milestone se ha eliminado
        sleep(2)

        # Crear una nueva lista con todos los textos en los elementos <p> después de eliminar
        updated_milestone_texts = [
            p.text.strip() for p in WebDriverWait(driver, 10).until(
                lambda d: d.find_elements(By.TAG_NAME, "p")
            )
        ]
        print(f"Lista de milestones después de eliminar: {updated_milestone_texts}")

        # Comparar las dos listas para identificar qué milestone se eliminó
        deleted_milestones = set(initial_milestone_texts) - set(updated_milestone_texts)
        self.assertTrue(
            "Testing Milestones" in deleted_milestones,
            "El milestone 'Testing Milestones' no fue eliminado correctamente."
        )
        print(f"Milestone eliminado: {deleted_milestones}")


    def test_edit_milestone(self):
        """Test para editar un milestone y validar los cambios."""
        self.login_as_Freelancer()
        self.navigate_to_project_details()
        self.navigate_to_milestones()
        self.create_milestone()
        self.validate_milestone_creation()
        self.login()
        self.navigate_to_project_details()
        self.navigate_to_milestones()
        self.edit_milestone()
        self.validate_updated_milestone()
        print("Test completado: Edición de milestone validada.")
        #self.delete_milestone()
        #print("Test completado: Eliminación de milestone validada.")


    def tearDown(self):
        print("Cerrando el navegador...")
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
