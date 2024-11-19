from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import unittest
#1 test
class ScrollInviteFreelancerTest(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.get("http://localhost:29002/auth/sign-in")

    def login(self):
        """Iniciar sesión con Kevin Nieto."""
        driver = self.driver
        print("Iniciando sesión con Kevin Nieto...")

        email_field = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "emailSign"))
        )
        email_field.send_keys("kevin.nieto@example.com")

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

    def test_invite_freelancer(self):
        """Test para invitar a un freelancer a un proyecto."""
        driver = self.driver

        # Iniciar sesión
        self.login()

        # Navegar al botón Freelance Now y hacer clic
        freelance_now_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//a[@href='/']//h6[text()='Freelance Now']"))
        )
        freelance_now_button.click()
        print("Navegando a la pantalla principal...")

        # En lugar de buscar solo por ID, usa XPath para buscar el tercer elemento con ese ID
        freelancer_card = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "(//div[@id='freelancerCard'])[3]"))
        )
        self.scroll_to_element(freelancer_card)
        print("Elemento 'freelancerCard' encontrado y visible en pantalla.")

        # Hacer clic en la tarjeta del freelancer
        freelancer_card.click()
        print("Clic en 'freelancerCard' realizado.")

        # Scrollear hacia arriba
        driver.execute_script("window.scrollTo(0, 0);")
        print("Scrolling hacia arriba realizado.")

        # Verificar que el botón 'Invite' esté visible
        invite_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[text()='Invite']"))
        )
        invite_button.click()
        print("Botón 'Invite' clicado, se abrió el pop-up.")

        # Seleccionar un proyecto en el menú desplegable
        dropdown_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[@role='combobox']"))
        )
        dropdown_button.click()
        print("Menú desplegable abierto.")

        # Seleccionar la primera opción en el menú
        first_option = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//li[@role='option' and text()='Freelance Aplication']"))
        )
        first_option.click()
        print("Primera opción seleccionada en el menú desplegable.")

        # Hacer clic en el botón 'Invite' dentro del pop-up
        invite_popup_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "invite"))
        )
        invite_popup_button.click()
        print("Invitación realizada.")

        # Validar que no hay errores en la pantalla
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
