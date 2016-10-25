from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class MinTests(TranspileTestCase):
    pass


class BuiltinMinFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["min"]

    def test_arguments(self):
        self.assertCodeExecution("""
            print(max(1, 2, 4, 55))
            """)

    def test_set(self):
        self.assertCodeExecution("""
            x = set()
            print(min(x))
            """)

        self.assertCodeExecution("""
            x = {1, 2, 3, 4, 5}
            print(min(x))
            """)

        self.assertCodeExecution("""
            x = {"abb", "bvs", "csd", "dfd", "ere"}
            print(min(x))
            """)

    def test_frozenset(self):
        self.assertCodeExecution("""
            x = frozenset()
            print(min(x))
            """)

        self.assertCodeExecution("""
            x = frozenset((1, 2, 3, 4, 5))
            print(min(x))
            """)

        self.assertCodeExecution("""
            x = frozenset(("abb", "bvs", "csd", "dfd", "ere"))
            print(min(x))
            """)

    not_implemented = [
        'test_bytearray'
    ]
