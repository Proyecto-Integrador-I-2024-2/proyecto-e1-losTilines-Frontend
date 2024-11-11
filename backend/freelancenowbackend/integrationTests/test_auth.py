import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoAlertPresentException

class AuthTests(unittest.TestCase):
    BASE_URL = "http://localhost:29002/auth/sign-in"
    USERNAME = "admin@example.com"
    PASSWORD = "admin123"

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

        email_field = driver.find_element(By.XPATH, "//input[@placeholder='name@mail.com']")
        email_field.send_keys(self.USERNAME)

        password_field = driver.find_element(By.XPATH, "//input[@placeholder='********']")
        password_field.send_keys(self.PASSWORD)

        terms_checkbox = driver.find_element(By.XPATH, "//input[@type='checkbox']")
        terms_checkbox.click()

        login_button = driver.find_element(By.XPATH, "//button[text()='Entrar']")
        login_button.click()

        # Verificar alerta de éxito
        WebDriverWait(driver, 10).until(EC.alert_is_present())
        alert = driver.switch_to.alert
        self.assertIn("Login successful!", alert.text)
        alert.accept()

    def test_invalid_credentials(self):
        # Test con credenciales inválidas
        driver = self.driver
        email_field = driver.find_element(By.XPATH, "//input[@placeholder='name@mail.com']")
        email_field.send_keys("usuario@invalido.com")

        password_field = driver.find_element(By.XPATH, "//input[@placeholder='********']")
        password_field.send_keys("contraseña_incorrecta")

        login_button = driver.find_element(By.XPATH, "//button[text()='Entrar']")
        login_button.click()

        # Verificar ambas alertas de error para credenciales inválidas
        self.verify_error_alerts()

    def test_empty_fields(self):
        # Test con campos vacíos
        driver = self.driver
        login_button = driver.find_element(By.XPATH, "//button[text()='Entrar']")
        login_button.click()

        # Verificar ambas alertas de error para campos vacíos
        self.verify_error_alerts()

    def test_invalid_email_format(self):
        # Test con formato de correo inválido
        driver = self.driver
        email_field = driver.find_element(By.XPATH, "//input[@placeholder='name@mail.com']")
        email_field.send_keys("usuario-invalido")

        password_field = driver.find_element(By.XPATH, "//input[@placeholder='********']")
        password_field.send_keys("contraseña")

        terms_checkbox = driver.find_element(By.XPATH, "//input[@type='checkbox']")
        terms_checkbox.click()

        login_button = driver.find_element(By.XPATH, "//button[text()='Entrar']")
        login_button.click()

        # Verificar ambas alertas de error para formato de correo inválido
        self.verify_error_alerts()

    #def test_terms_and_conditions_unchecked(self):
    #    # Test con casilla de términos no seleccionada
    #   driver = self.driver
    #    email_field = driver.find_element(By.XPATH, "//input[@placeholder='name@mail.com']")
    #    email_field.send_keys(self.USERNAME)

    #    password_field = driver.find_element(By.XPATH, "//input[@placeholder='********']")
    #    password_field.send_keys(self.PASSWORD)

    #    login_button = driver.find_element(By.XPATH, "//button[text()='Entrar']")
    #    login_button.click()

        # Verificar ambas alertas de error para términos no seleccionados
    #    self.verify_error_alerts()

if __name__ == "__main__":
    unittest.main()
