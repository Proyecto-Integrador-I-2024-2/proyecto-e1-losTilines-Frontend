import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoAlertPresentException
#LISTO. 8 Tests
class AuthTests(unittest.TestCase):
    BASE_URL = "http://localhost:29002/auth/sign-in"
    USERNAME = "ricardo.urbina@example.com"
    PASSWORD = "123"

    def setUp(self):
        # Inicializar el navegador
        self.driver = webdriver.Chrome()
        self.driver.get(self.BASE_URL)

    def tearDown(self):
        # Cerrar el navegador después de cada prueba
        self.driver.quit()

    def capture_alert_text(self, expected_text):
        # Captura y verifica el texto de la alerta
        try:
            alert = WebDriverWait(self.driver, 5).until(EC.alert_is_present())
            alert_text = alert.text
            self.assertEqual(alert_text, expected_text, f"Mensaje de alerta inesperado: {alert_text}")
            alert.accept()
        except NoAlertPresentException:
            self.fail(f"No se encontró la alerta esperada con el texto: {expected_text}")

    def verify_error_alerts(self):
        # Verifica ambas alertas de error en secuencia
        self.capture_alert_text("Login failed! Check your credentials.")
        self.capture_alert_text("Login failed! [object Object]")

    def test_successful_login(self):
        # Test de inicio de sesión exitoso
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

    # 1. Pruebas de campos vacíos
    def test_login_with_empty_email(self):
        driver = self.driver

        email_field = driver.find_element(By.ID, "emailSign")
        email_field.clear()

        password_field = driver.find_element(By.ID, "passwordSign")
        password_field.clear()  # Asegura que el campo esté vacío
        password_field.send_keys(self.PASSWORD)

        terms_checkbox = driver.find_element(By.ID, "termsAndConditions")
        terms_checkbox.click()

        login_button = driver.find_element(By.ID, "entrar")
        login_button.click()

        self.verify_error_alerts

    def test_login_with_empty_password(self):
        driver = self.driver
        email_field = driver.find_element(By.ID, "emailSign")
        email_field.clear()  # Asegura que el campo esté vacío
        email_field.send_keys(self.USERNAME)

        password_field = driver.find_element(By.ID, "passwordSign")
        password_field.clear()  # Asegura que el campo esté vacío

        terms_checkbox = driver.find_element(By.ID, "termsAndConditions")
        terms_checkbox.click()

        login_button = driver.find_element(By.ID, "entrar")
        login_button.click()

        self.verify_error_alerts

    def test_login_with_empty_fields(self):
        driver = self.driver
        email_field = driver.find_element(By.ID, "emailSign")
        email_field.clear()  # Limpia el campo de email

        password_field = driver.find_element(By.ID, "passwordSign")
        password_field.clear()  # Limpia el campo de contraseña

        login_button = driver.find_element(By.ID, "entrar")
        login_button.click()

        self.verify_error_alerts

    # 2. Pruebas de credenciales incorrectas
    def test_login_with_invalid_email(self):
        driver = self.driver
        email_field = driver.find_element(By.ID, "emailSign")
        email_field.send_keys("incorrecto@example.com")

        password_field = driver.find_element(By.ID, "passwordSign")
        password_field.send_keys(self.PASSWORD)

        terms_checkbox = driver.find_element(By.ID, "termsAndConditions")
        terms_checkbox.click()

        login_button = driver.find_element(By.ID, "entrar")
        login_button.click()

        self.capture_alert_text("Login failed! Check your credentials.")

    def test_login_with_invalid_password(self):
        driver = self.driver
        email_field = driver.find_element(By.ID, "emailSign")
        email_field.send_keys(self.USERNAME)

        password_field = driver.find_element(By.ID, "passwordSign")
        password_field.send_keys("incorrect_password")

        terms_checkbox = driver.find_element(By.ID, "termsAndConditions")
        terms_checkbox.click()

        login_button = driver.find_element(By.ID, "entrar")
        login_button.click()

        self.capture_alert_text("Login failed! Check your credentials.")

    def test_login_with_invalid_credentials(self):
        driver = self.driver
        email_field = driver.find_element(By.ID, "emailSign")
        email_field.send_keys("incorrecto@example.com")

        password_field = driver.find_element(By.ID, "passwordSign")
        password_field.send_keys("incorrect_password")

        terms_checkbox = driver.find_element(By.ID, "termsAndConditions")
        terms_checkbox.click()

        login_button = driver.find_element(By.ID, "entrar")
        login_button.click()

        self.capture_alert_text("Login failed! Check your credentials.")

    # 4. Prueba de tiempo de espera de alerta
    def test_alert_timeout(self):
        driver = self.driver
        email_field = driver.find_element(By.ID, "emailSign")
        email_field.send_keys(self.USERNAME)

        password_field = driver.find_element(By.ID, "passwordSign")
        password_field.send_keys(self.PASSWORD)

        terms_checkbox = driver.find_element(By.ID, "termsAndConditions")
        terms_checkbox.click()

        login_button = driver.find_element(By.ID, "entrar")
        login_button.click()

        # Esperar que la alerta esté presente o lanzar un error si no aparece en 5 segundos
        try:
            WebDriverWait(driver, 5).until(EC.alert_is_present())
            alert = driver.switch_to.alert
            self.assertIn("Login successful!", alert.text)
            alert.accept()
        except TimeoutException:
            self.fail("Expected alert not displayed within the timeout period.")

if __name__ == "__main__":
    unittest.main()
