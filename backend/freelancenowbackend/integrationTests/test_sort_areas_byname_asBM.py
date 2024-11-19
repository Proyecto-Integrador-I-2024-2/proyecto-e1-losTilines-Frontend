from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import unittest
#LISTO 1 test
class SortAreasByNameTest(unittest.TestCase):

    USERNAME = "raul.quigua@example.com"
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

    def navigate_to_areas_page(self):
        driver = self.driver
        print("Navegando a la página de áreas...")

        WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//h3[text()='Areas']/following::button[text()='See all'][1]"))
        ).click()

        WebDriverWait(driver, 10).until(
            EC.url_to_be("http://localhost:29002/dashboard/areas/")
        )
        print("Página de áreas abierta.")

    def get_area_names(self):
        """Obtiene una lista de nombres de áreas en su orden actual en la página."""
        driver = self.driver

        area_elements = driver.find_elements(By.XPATH, "//h5[@class='block antialiased tracking-normal font-sans text-xl font-semibold leading-snug text-black']")
        area_names = [area.text for area in area_elements]
        print("Nombres de áreas capturados:", area_names)
        return area_names

    def test_sort_areas_by_name(self):
        """Test para verificar la funcionalidad de ordenamiento de áreas por nombre."""
        self.login()
        self.navigate_to_areas_page()


        initial_area_names = self.get_area_names()


        sort_button = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[text()='Sort by area name']"))
        )
        sort_button.click()
        print("Botón de ordenamiento por nombre de área clicado.")


        sorted_area_names = self.get_area_names()


        is_sorted_ascending = sorted_area_names == sorted(initial_area_names)
        is_sorted_descending = sorted_area_names == sorted(initial_area_names, reverse=True)
        
        self.assertTrue(is_sorted_ascending or is_sorted_descending, "Las áreas no están ordenadas alfabéticamente ni de A-Z ni de Z-A.")
        print("Test de ordenamiento de áreas por nombre completado con éxito.")

    def tearDown(self):
        print("Cerrando el navegador...")
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
