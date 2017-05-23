import unittest

import random

class RandomTests(unittest.TestCase):

    def test_choice(self):
        numbers = [1, 2, 3, 4, 5, 6, 7, 8]
        random_number = random.choice(numbers)
        self.assertIn(random_number, numbers)
