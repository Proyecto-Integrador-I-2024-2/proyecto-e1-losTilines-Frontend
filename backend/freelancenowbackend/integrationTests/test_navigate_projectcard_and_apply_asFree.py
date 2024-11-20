from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import unittest
#1 test
class ApplyToProjectTest(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.get("http://localhost:29002/auth/sign-in")

    def login(self):
        """Iniciar sesión como Ricardo Urbina."""
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

    def scroll_to_element(self, element):
        """Función auxiliar para hacer scrolling hasta un elemento específico."""
        self.driver.execute_script("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", element)

    def test_apply_to_project(self):
        """Test para aplicar a un proyecto como Ricardo Urbina."""
        driver = self.driver

        # Iniciar sesión
        self.login()

        # Navegar al botón Freelance Now y hacer clic
        freelance_now_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//a[@href='/']//h6[text()='Freelance Now']"))
        )
        freelance_now_button.click()
        print("Navegando a la pantalla principal de Freelance Now...")

        # En lugar de buscar solo por ID, usa XPath para buscar el tercer elemento con ese ID
        project_card = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "(//div[@id='projectCard'])[2]"))
        )
        self.scroll_to_element(project_card)
        project_card.click()
        print("Clic en la tarjeta de proyecto realizado.")

        # Subir hacia arriba para encontrar el botón "Apply Now"
        driver.execute_script("window.scrollTo(0, 0);")
        print("Scrolling hacia arriba realizado.")

        # Hacer clic en el botón "Apply Now"
        apply_now_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[text()='Apply Now!']"))
        )
        apply_now_button.click()
        print("Botón 'Apply Now!' clicado, se abrió el pop-up.")

        # Hacer clic en el botón "I'm interested" dentro del pop-up
        im_interested_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "imInterestedButton"))
        )
        im_interested_button.click()
        print("Botón 'I'm interested' clicado.")

        # Validar que no hay errores visibles
        print("Validando que no hay errores visibles...")
        WebDriverWait(driver, 5).until_not(
            EC.presence_of_element_located((By.XPATH, "//h3[contains(text(), 'Error')]"))
        )
        print("Test completado: No se encontraron errores durante el proceso.")

    def tearDown(self):
        print("Cerrando el navegador...")
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
