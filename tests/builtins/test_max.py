from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class MaxTests(TranspileTestCase):
    pass


class BuiltinMaxFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["max"]

    def test_arguments(self):
        self.assertCodeExecution("""
            print(max(1, 2, 4, 55))
            """)

    def test_set(self):
        self.assertCodeExecution("""
            x = set()
            print(max(x))
            """)

        self.assertCodeExecution("""
            x = {1, 2, 3, 4, 5}
            print(max(x))
            """)

        self.assertCodeExecution("""
            x = {"abb", "bvs", "csd", "dfd", "ere"}
            print(max(x))
            """)

    def test_frozenset(self):
        self.assertCodeExecution("""
            x = frozenset()
            print(max(x))
            """)

        self.assertCodeExecution("""
            x = frozenset((1, 2, 3, 4, 5))
            print(max(x))
            """)

        self.assertCodeExecution("""
            x = frozenset(("abb", "bvs", "csd", "dfd", "ere"))
            print(max(x))
            """)

    not_implemented = [
        'test_bytearray'
    ]
