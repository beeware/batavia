from ..utils import TranspileTestCase


class RandomTests(TranspileTestCase):
    def test_choice(self):
        self.assertCodeExecution("""
            import random

            numbers = [1, 2, 3, 4, 5, 6, 7, 8]
            random_number = random.choice(numbers)
            print(random_number in numbers)
            """)

    def test_random(self):
        self.assertCodeExecution("""
            import random

            r = random.random()
            print(type(r))
            """)
