from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import unittest
from time import sleep
#LISTO 1 Test
class ProfileGitHubLinkTest(unittest.TestCase):

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

    def test_github_link_opens_new_window(self):
        """Test para verificar que el botón de GitHub abre una nueva ventana con la URL de GitHub."""
        self.login()
        self.navigate_to_profile()

        driver = self.driver
        original_window = driver.current_window_handle

        github_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "Github"))
        )
        github_button.click()
        print("Botón de GitHub clicado.")

        WebDriverWait(driver, 10).until(EC.number_of_windows_to_be(2))

        new_window = [window for window in driver.window_handles if window != original_window][0]
        driver.switch_to.window(new_window)

        WebDriverWait(driver, 10).until(EC.url_contains("https://github.com/"))
        self.assertEqual(driver.current_url, "https://github.com/", "La URL no coincide con la de GitHub.")
        print("Test completado: Se abrió la ventana de GitHub correctamente.")

        driver.close()
        driver.switch_to.window(original_window)

    def tearDown(self):
        print("Cerrando el navegador...")
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
