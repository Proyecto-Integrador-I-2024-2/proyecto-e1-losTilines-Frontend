from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import unittest

#LISTO 2 test
class EditUserProfileTests(unittest.TestCase):

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

    
    def edit_profile(self, new_name, new_phone):
        driver = self.driver

        profile_container = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//div[h6[text()='Profile Information']]"))
        )

        edit_button = profile_container.find_element(By.XPATH, ".//button[@type='button']")
        edit_button.click()

        first_name_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.NAME, "first_name"))
        )
        first_name_input.clear()
        first_name_input.send_keys(new_name)

        phone_input = driver.find_element(By.NAME, "phone_number")
        phone_input.clear()
        phone_input.send_keys(new_phone)

        save_button = driver.find_element(By.XPATH, "//button[text()='Save Changes']")
        save_button.click()


    def test_edit_user_profile(self):
        """Test para editar el nombre y el teléfono en el perfil de usuario."""
        self.login()
        self.navigate_to_profile()

        new_name = "Richard"
        new_phone = "(+57)3154321"

        self.edit_profile(new_name, new_phone)

        updated_name = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//p[text()='Richard']"))
        )
        self.assertEqual(updated_name.text, "Richard")

        updated_phone = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//p[text()='(+57)3154321']"))
        )
        self.assertEqual(updated_phone.text, "(+57)3154321")


        print("Test de edición de perfil completado con éxito.")


    def edit_phone_number(self, invalid_phone_number):
        driver = self.driver
        profile_container = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//div[h6[text()='Profile Information']]"))
        )

        edit_button = profile_container.find_element(By.XPATH, ".//button[@type='button']")
        edit_button.click()

        phone_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "phone_number"))
        )
        phone_input.clear()
        phone_input.send_keys(invalid_phone_number)

        save_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "save_changes"))
        )
        save_button.click()
        print("Botón 'Save Changes' clicado con número de teléfono inválido.")

    def test_invalid_phone_number(self):
        """Test para verificar que un número de teléfono inválido no se guarda."""
        self.login()
        self.navigate_to_profile()

        invalid_phone_number = "1234567890123456"  # 16 dígitos

        self.edit_phone_number(invalid_phone_number)

        elements = self.driver.find_elements(By.XPATH, f"//span[text()='{invalid_phone_number}']")
        self.assertEqual(len(elements), 0, "El número de teléfono inválido fue encontrado, pero no debería estar presente.")
        print("Verificación completada: el número de teléfono inválido no fue guardado.")


    def tearDown(self):
        print("Cerrando el navegador...")
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
