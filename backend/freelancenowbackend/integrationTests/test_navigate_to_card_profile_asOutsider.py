from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import unittest
#LISTO 1 test
class ScrollAndClickTest(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.get("http://localhost:29002/")

    def scroll_to_element(self, element):
        """Función auxiliar para hacer scrolling hasta un elemento específico."""
        self.driver.execute_script("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", element)

    def test_scroll_and_click_freelancer_card(self):
        """Test para hacer scroll hasta 'freelancerCard', hacer clic y verificar la redirección."""
        driver = self.driver

        # Hacer scroll hasta que 'freelancerCard' sea visible
        freelancer_card = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "freelancerCard"))
        )
        self.scroll_to_element(freelancer_card)
        print("Elemento 'freelancerCard' encontrado y visible en pantalla.")

        # Hacer clic en el 'freelancerCard'
        freelancer_card.click()
        print("Clic en 'freelancerCard' realizado.")

        # Esperar a que la redirección a la nueva pantalla complete y hacer scroll hacia arriba
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        driver.execute_script("window.scrollTo(0, 0);")  # Scrolling hasta arriba
        print("Scrolling hasta arriba realizado.")

        # Verificar que el texto 'Profile Information' está visible
        profile_info_header = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.XPATH, "//h6[text()='Profile Information']"))
        )
        self.assertTrue(profile_info_header.is_displayed(), "El texto 'Profile Information' no es visible en la pantalla.")
        print("Test completado: 'Profile Information' encontrado en la pantalla.")

    def tearDown(self):
        print("Cerrando el navegador...")
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
