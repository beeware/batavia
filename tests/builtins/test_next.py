from unittest import expectedFailure

from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class NextTests(TranspileTestCase):

    def test_next_success(self):
        self.assertCodeExecution("""
            i = iter([1])
            print(next(i))
        """)

    def test_next_success_with_default(self):
        self.assertCodeExecution("""
            i = iter([1])
            print(next(i, 0))
        """)

    def test_next_exhausted_with_default(self):
        self.assertCodeExecution("""
            i = iter([])
            print(next(i, 0))
        """)

    def test_next_exhausted_without_default(self):
        self.assertCodeExecution("""
        try:
            i = iter([])
            print(next(i))
        except StopIteration:
            print("Done.")
        """)


class BuiltinNextFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "next"
