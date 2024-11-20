from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import unittest

class RegistrationClientTests(unittest.TestCase):

    BASE_URL = "http://localhost:29002/auth/sign-up"

    @classmethod
    def setUpClass(cls):
        print("Iniciando el navegador y accediendo a la página de registro (Client)...")
        cls.driver = webdriver.Chrome()
        cls.driver.get(cls.BASE_URL)
        print("Página de registro cargada.")

    @classmethod
    def tearDownClass(cls):
        print("Cerrando el navegador...")
        cls.driver.quit()

    def test_register_as_client(self):
        driver = self.driver

        try:
            # Seleccionar la pestaña "Client"
            print("Esperando que el texto 'Client' sea visible...")
            WebDriverWait(driver, 10).until(
                EC.visibility_of_element_located((By.XPATH, "//div[text()='Client']"))
            )
            print("Texto 'Client' encontrado.")
            
            print("Haciendo clic en la pestaña 'Client'...")
            client_tab = driver.find_element(By.ID, "clientTab")
            client_tab.click()

            # Completa el formulario de registro para el cliente
            print("Rellenando el formulario de registro del cliente...")
            driver.find_element(By.XPATH, "//input[@placeholder='First name']").send_keys("Carlos")
            print("Nombre completado.")
            driver.find_element(By.XPATH, "//input[@placeholder='Last name']").send_keys("Martínez")
            print("Apellido completado.")
            driver.find_element(By.XPATH, "//input[@placeholder='email@example.com']").send_keys("carlos.martinez@example.com")
            print("Correo electrónico completado.")
            driver.find_element(By.XPATH, "//input[@placeholder='Phone number']").send_keys("3012345678")
            print("Número de teléfono completado.")
            driver.find_element(By.XPATH, "//input[@placeholder='Password']").send_keys("SuperSecureClientPass123")
            print("Contraseña completada.")

            # Campos adicionales del cliente
            driver.find_element(By.XPATH, "//input[@placeholder='Company name']").send_keys("Martínez Solutions")
            print("Nombre de la empresa completado.")
            driver.find_element(By.XPATH, "//input[@placeholder='Company tax id']").send_keys("123456789")
            print("Tax ID completado.")
            driver.find_element(By.XPATH, "//input[@placeholder='City']").send_keys("Bogotá")
            print("Ciudad completada.")
            driver.find_element(By.XPATH, "//input[@placeholder='Country']").send_keys("Colombia")
            print("País completado.")
            driver.find_element(By.XPATH, "//input[@placeholder='Address']").send_keys("Calle 123 #45-67")
            print("Dirección completada.")
            driver.find_element(By.XPATH, "//input[@placeholder='Company telephone']").send_keys("3001234567")
            print("Teléfono de la empresa completado.")
            driver.find_element(By.XPATH, "//input[@placeholder='Company email']").send_keys("company@example.com")
            print("Correo de la empresa completado.")

            # Acepta los términos y condiciones
            print("Seleccionando la casilla de términos y condiciones...")
            terms_checkbox = driver.find_element(By.XPATH, "//input[@type='checkbox']")
            terms_checkbox.click()

            # Envía el formulario
            print("Haciendo clic en el botón 'Register Now'...")
            register_button = driver.find_element(By.XPATH, "//button[text()='Register Now']")
            register_button.click()

            # Espera la redirección
            print("Esperando redirección a la página de éxito o dashboard...")
            WebDriverWait(driver, 10).until(EC.url_contains("auth/sign-in"))  # Cambia "/dashboard" según la URL de redirección de éxito
            print("Test de registro de cliente completado con éxito")

        except Exception as e:
            print(f"Error durante el test de registro del cliente: {e}")
            self.fail(f"Error durante el test de registro del cliente: {e}")


if __name__ == "__main__":
    unittest.main()
