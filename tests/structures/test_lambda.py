from ..utils import TranspileTestCase

import unittest


class LambdaTests(TranspileTestCase):
    def test_no_arguments(self):
        self.assertCodeExecution("""
            x = lambda: 1
            print(x())
            print("Done.")
            """)

    @unittest.expectedFailure
    def test_no_arguments_extra_positional(self):
        self.assertCodeExecution("""
            x = lambda: x
            print(x(1))
            print("Done.")
            """)

    def test_no_arguments_extra_keyword(self):
        self.assertCodeExecution("""
            x = lambda: x
            print(x(a=1))
            print("Done.")
            """)

    def test_one_argument(self):
        self.assertCodeExecution("""
            x = lambda a: a + 7
            print(x(3))
            print("Done.")
            """)

    def test_one_argument_missing_positional(self):
        self.assertCodeExecution("""
            x = lambda a: a + 7
            print(x())
            print("Done.")
            """)

    @unittest.expectedFailure
    def test_one_argument_missing_keyword(self):
        self.assertCodeExecution("""
            x = lambda a, *, c: a + 7
            print(x(1))
            print("Done.")
            """)

    @unittest.expectedFailure
    def test_one_argument_extra_positional(self):
        self.assertCodeExecution("""
            x = lambda a: a + 7
            print(x(1, 2))
            print("Done.")
            """)

    def test_one_argument_extra_keyword(self):
        self.assertCodeExecution("""
            x = lambda a: a + 7
            print(x(1, a=3))
            print("Done.")
            """)

    def test_two_arguments_missing_both(self):
        self.assertCodeExecution("""
            x = lambda a, b: a ** b
            print(x())
            print("Done.")
            """)

    def test_two_arguments_missing_one(self):
        self.assertCodeExecution("""
            x = lambda a, b: a ** b
            print(x(1))
            print("Done.")
            """)

    def test_three_arguments(self):
        self.assertCodeExecution("""
            x = lambda a, b, c: a ** b + c
            print(x(4, 5, 6))
            print("Done.")
            """)

    def test_three_arguments_missing_all(self):
        self.assertCodeExecution("""
            x = lambda a, b, c: a ** b + c
            print(x())
            print("Done.")
            """)

    def test_three_arguments_missing_two(self):
        self.assertCodeExecution("""
            x = lambda a, b, c: a ** b + c
            print(x(1))
            print("Done.")
            """)

    def test_three_arguments_missing_one(self):
        self.assertCodeExecution("""
            x = lambda a, b, c: a ** b + c
            print(x(1, 2))
            print("Done.")
            """)
