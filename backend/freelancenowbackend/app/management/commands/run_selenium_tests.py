import os
import sys
import unittest
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = "Run Selenium integration tests in a specified order."

    def handle(self, *args, **kwargs):

        test_files_in_order = [
            "integrationTests/test_auth.py",
            "integrationTests/test_register_user.py",
            "integrationTests/test_create_worker.py",
            "integrationTests/test_navigate_getStarted.py",
            "integrationTests/test_navigate_github.py",
            "integrationTests/test_create_area_from_dashboard.py",
            "integrationTests/test_create_area_from_areapage.py",
            "integrationTests/test_sort_areas_byname.py",
            "integrationTests/test_changename_area.py",
            "integrationTests/test_edit_user_profile.py",
            "integrationTests/test_edit_experience.py",
            "integrationTests/test_edit_skills.py",
            "integrationTests/test_navigate_to_card_profile.py",
            "integrationTests/test_navigate_to_card_project.py",
            # Agrega más archivos en el orden que prefieras
        ]

        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

        os.chdir(base_dir)

        for test_file in test_files_in_order:
            full_path = os.path.join(base_dir, test_file)
            if os.path.exists(full_path):
                print(f"Running test: {test_file}")
                result = unittest.TextTestRunner().run(unittest.defaultTestLoader.loadTestsFromName(test_file.replace("/", ".").replace(".py", "")))
                if not result.wasSuccessful():
                    print(f"Test {test_file} failed.")
                    sys.exit(1)  # Sale con error si algún test falla
            else:
                print(f"Test file {test_file} does not exist.")
