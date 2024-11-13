from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import unittest

class ScrollAndClickAutomationCardTest(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.get("http://localhost:29002/")

    def scroll_to_element(self, element):
        """Función auxiliar para hacer scrolling hasta un elemento específico."""
        self.driver.execute_script("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", element)

    def test_scroll_and_click_automation_card(self):
        """Test para hacer scroll hasta el card de 'Automatización de Procesos', hacer clic y verificar redirección."""
        driver = self.driver

        automation_card = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//h6[text()='Automatización de Procesos']/ancestor::div[contains(@class, 'cursor-pointer')]"))
        )
        self.scroll_to_element(automation_card)
        print("Elemento 'Automatización de Procesos' encontrado y visible en pantalla.")

        automation_card.click()
        print("Clic en el card de 'Automatización de Procesos' realizado.")

        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        driver.execute_script("window.scrollTo(0, 0);")  # Scrolling hasta arriba
        print("Scrolling hasta arriba realizado.")

        apply_button = WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located((By.ID, "applyNowButton"))
        )
        self.assertTrue(apply_button.is_displayed(), "El botón 'Apply Now!' no es visible en la pantalla.")
        print("Test completado: el botón 'Apply Now!' fue encontrado en la pantalla.")

    def tearDown(self):
        print("Cerrando el navegador...")
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
