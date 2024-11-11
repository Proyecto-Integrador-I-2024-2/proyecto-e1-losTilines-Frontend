from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import unittest

class RegistrationTests(unittest.TestCase):

    BASE_URL = "http://localhost:29002/auth/sign-up"

    @classmethod
    def setUpClass(cls):
        print("Iniciando el navegador y accediendo a la página de registro...")
        cls.driver = webdriver.Chrome()
        cls.driver.get(cls.BASE_URL)
        print("Página de registro cargada.")

    @classmethod
    def tearDownClass(cls):
        print("Cerrando el navegador...")
        cls.driver.quit()

    def test_register_as_freelancer(self):
        driver = self.driver

        try:
            # Espera a que el texto "Freelancer" esté visible en la página
            print("Esperando que el texto 'Freelancer' sea visible...")
            WebDriverWait(driver, 10).until(
                EC.visibility_of_element_located((By.XPATH, "//div[text()='Freelancer']"))
            )
            print("Texto 'Freelancer' encontrado.")

            # Verificar si el recuadro blanco está visible encima del texto "Freelancer"
            print("Esperando que el recuadro blanco esté visible sobre el texto 'Freelancer'...")
            WebDriverWait(driver, 10).until(
                EC.visibility_of_element_located((By.XPATH, "//div[@class='absolute inset-0 z-10 h-full bg-white rounded-md shadow']"))
            )
            print("Rango de selección 'Freelancer' confirmado.")

            # Completa el formulario de registro
            print("Rellenando el formulario de registro...")
            driver.find_element(By.XPATH, "//input[@placeholder='First name']").send_keys("Juan")
            print("Nombre completado.")
            driver.find_element(By.XPATH, "//input[@placeholder='Last name']").send_keys("Pérez")
            print("Apellido completado.")
            driver.find_element(By.XPATH, "//input[@placeholder='Username']").send_keys("juanperez123")
            print("Nombre de usuario completado.")
            driver.find_element(By.XPATH, "//input[@placeholder='email@example.com']").send_keys("juanperez@example.com")
            print("Correo electrónico completado.")
            driver.find_element(By.XPATH, "//input[@placeholder='Phone number']").send_keys("3001234567")
            print("Número de teléfono completado.")
            driver.find_element(By.XPATH, "//input[@placeholder='Password']").send_keys("SuperSecurePass123")
            print("Contraseña completada.")

            # Acepta los términos y condiciones
            print("Seleccionando la casilla de términos y condiciones...")
            terms_checkbox = driver.find_element(By.XPATH, "//input[@type='checkbox']")
            terms_checkbox.click()

            # Envía el formulario
            print("Haciendo clic en el botón 'Register Now'...")
            register_button = driver.find_element(By.XPATH, "//button[text()='Register Now']")
            register_button.click()

            # Verifica que estamos en la página esperada después del registro
            print("Esperando redirección a la página de éxito o dashboard...")
            WebDriverWait(driver, 10).until(EC.url_contains("/dashboard"))  # Cambia "/dashboard" según la URL de redirección de éxito
            print("Test de registro completado con éxito")

        except Exception as e:
            print(f"Error durante el test de registro: {e}")
            self.fail(f"Error durante el test de registro: {e}")

# Ejecuta todos los tests en este archivo
if __name__ == "__main__":
    unittest.main()

#PONER CASO DE EXITO