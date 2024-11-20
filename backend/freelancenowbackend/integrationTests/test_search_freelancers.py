from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import unittest
from time import sleep
#4 tests
class SearchTests(unittest.TestCase):
    USERNAME = "sara.diaz@example.com"
    PASSWORD = "123"

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.get("http://localhost:29002/auth/sign-in")

    def login(self):
        driver = self.driver
        print("Iniciando sesión...")

        email_field = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "emailSign"))
        )
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
        print("Inicio de sesión exitoso.")

    def navigate_to_search(self):
        """Navega a la pantalla de búsqueda."""
        driver = self.driver
        search_navbar = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "searchNavbar"))
        )
        search_navbar.click()
        print("Navegando a la pantalla de búsqueda.")

    def test_freelancer_tab(self):
        """Verifica que al seleccionar 'Freelancers' se muestre el freelancer Ricardo Urbina."""
        self.login()
        self.navigate_to_search()

        freelancers_tab = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.ID, "freelancersTab"))
        )
        freelancers_tab.click()
        print("Pestaña 'Freelancers' seleccionada.")

        freelancer_name = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//h6[text()='Ricardo Urbina']"))
        )
        self.assertIsNotNone(freelancer_name, "No se encontró el freelancer 'Ricardo Urbina'.")
        print("Freelancer 'Ricardo Urbina' encontrado.")

    def test_search_by_name(self):
        """Verifica que al buscar 'Ricardo' el número de cards se reduzca a 1."""
        self.login()
        self.navigate_to_search()

        # Contar las cards iniciales
        initial_cards = self.driver.find_elements(By.ID, "freelancerCard")
        print(f"Número inicial de cards: {len(initial_cards)}")

        # Buscar por nombre 'Ricardo'
        search_input = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, "searchInput"))
        )
        search_input.send_keys("Ricardo")
        sleep(2)

        filtered_cards = self.driver.find_elements(By.ID, "freelancerCard")
        print(f"Número de cards después del filtro: {len(filtered_cards)}")

        self.assertEqual(len(filtered_cards), 1, "El número de cards no se redujo a 1.")
        print("Filtro por nombre validado correctamente.")

    def test_filter_by_skill(self):
        """Filtra por habilidad y verifica que el número de cards se reduzca."""
        self.login()
        self.navigate_to_search()

        filter_button = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.ID, "filterBySkill"))
        )
        filter_button.click()
        print("Botón de filtro por habilidad abierto.")

        # Seleccionar la habilidad por ID
        skill_option = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.ID, "material-tailwind-select-2"))
        )
        skill_option.click()
        print("Habilidad seleccionada.")

        sleep(2)

        filtered_cards = self.driver.find_elements(By.ID, "freelancerCard")
        print(f"Número de cards después del filtro: {len(filtered_cards)}")
        self.assertLess(len(filtered_cards), 5, "El número de cards no se redujo tras filtrar por habilidad.")

    def filter_names(self, elements):
        """Filtra los nombres, excluyendo 'Freelance Now'."""
        return [element.text for element in elements if element.text != "Freelance Now"]

    def test_sort_by_name_desc(self):

        self.login()
        self.navigate_to_search()

        # Abrir el menú de ordenación y seleccionar A-Z
        sort_button = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.ID, "sortButton"))
        )
        sort_button.click()
        print("Menú de ordenación abierto.")

        sort_option_asc = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.ID, "material-tailwind-select-0"))
        )
        sort_option_asc.click()
        print("Opción de orden A-Z seleccionada.")

        sleep(2)

        # Crear la lista de nombres ordenados A-Z, omitiendo "Freelance Now"
        az_elements = self.driver.find_elements(By.XPATH, "//h6")
        az_names = self.filter_names(az_elements)
        print(f"Nombres ordenados A-Z (filtrados): {az_names}")

        # Abrir el menú de ordenación y seleccionar Z-A
        sort_button = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.ID, "sortButton"))
        )
        sort_button.click()
        print("Menú de ordenación abierto nuevamente.")

        sort_option_desc = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.ID, "material-tailwind-select-1"))
        )
        sort_option_desc.click()
        print("Opción de orden Z-A seleccionada.")

        sleep(2)

        # Crear la lista de nombres ordenados Z-A, omitiendo "Freelance Now"
        za_elements = self.driver.find_elements(By.XPATH, "//h6")
        za_names = self.filter_names(za_elements)
        print(f"Nombres ordenados Z-A (filtrados): {za_names}")

        # Validar que los nombres de Z-A son la reversa de los de A-Z
        self.assertEqual(za_names, list(reversed(az_names)), "El orden Z-A no es la reversa del orden A-Z.")
        print("Orden Z-A validado correctamente.")


    def tearDown(self):
        print("Cerrando el navegador...")
        self.driver.quit()


if __name__ == "__main__":
    unittest.main()
