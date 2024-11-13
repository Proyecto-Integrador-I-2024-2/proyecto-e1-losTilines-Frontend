from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
import unittest
from time import sleep

#LISTO 2 Test
class EditAreaNameTests(unittest.TestCase):

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

    def navigate_to_areas_page(self):
        driver = self.driver
        # Navegar al dashboard y abrir la página de áreas
        WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//h3[text()='Areas']/following::button[text()='See all'][1]"))
        ).click()

        # Esperar a que la página de áreas cargue
        WebDriverWait(driver, 10).until(
            EC.url_to_be("http://localhost:29002/dashboard/areas/")
        )

    def edit_area_name(self, new_area_name):
        driver = self.driver
        print(f"Editando el nombre del área a '{new_area_name}'...")

        # Localizar el contenedor que contiene el área y su botón de edición

        sleep(2)
        print("buscando pencil")
        edit_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "Pencil1"))
        )
        edit_button.click()
        print("pencil encontrado")
        sleep(2)
        # Esperar a que el input de edición sea visible y modificar el nombre
        name_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "areaname"))
        )
        name_input.clear()
        name_input.send_keys(new_area_name)

        # Hacer clic en el ícono de confirmación (checkmark)
        confirm_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "checkIconButton"))
        )
        confirm_button.click()

    def test_change_area_name(self):
        """Test para cambiar el nombre de un área existente."""
        self.login()
        self.navigate_to_areas_page()

        new_area_name = "Logística"

        self.edit_area_name( new_area_name)

        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, f"//h5[text()='{new_area_name}']"))
        )
        print("Test de cambio de nombre de área completado con éxito.")



    def test_edit_area_name_with_long_name(self):
        """Test para intentar cambiar el nombre de un área a un valor de 21 caracteres."""
        self.login()
        self.navigate_to_areas_page()

        long_area_name = "ThisIsAVeryLongAreaName!"  # 21 caracteres

        self.edit_area_name(long_area_name)

        expected_alert_text = (
            "There was an error updating the administrator area name: "
            "Error: AxiosError: Request failed with status code 400"
        )

        WebDriverWait(self.driver, 10).until(EC.alert_is_present())
        alert = self.driver.switch_to.alert
        alert_text = alert.text.strip().replace("\n", "").replace("  ", " ")
        
        # Comparar el texto normalizado
        self.assertEqual(alert_text, expected_alert_text, f"Mensaje de alerta inesperado: {alert_text}")
        alert.accept()
        print("Test completado: El mensaje de error de actualización apareció correctamente.")


    def tearDown(self):
        print("Cerrando el navegador...")
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
