from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import unittest

#LISTO 1 test
class GetStartedButtonTest(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.get("http://localhost:29002/")

    def test_get_started_button_redirects_to_sign_in(self):
        """Test para verificar que el botón 'Get Started' redirige a la página de inicio de sesión."""
        driver = self.driver

        # Hacer clic en el botón "Get Started"
        get_started_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "getStarted"))
        )
        get_started_button.click()
        print("Botón 'Get Started' clicado.")

        # Verificar que la URL es la de inicio de sesión
        WebDriverWait(driver, 10).until(EC.url_to_be("http://localhost:29002/auth/sign-in"))
        self.assertEqual(driver.current_url, "http://localhost:29002/auth/sign-in", "La URL no coincide con la de inicio de sesión.")
        print("Redirección a la página de inicio de sesión verificada correctamente.")

    def tearDown(self):
        print("Cerrando el navegador...")
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
