from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class EnumerateTests(TranspileTestCase):
    def test_enumerate_iter(self):
        self.assertCodeExecution("""
            iterator = enumerate('abc')
            print(next(iterator))
            print(next(iterator))
            print(next(iterator))
            try:
                print(next(iterator))
            except StopIteration:
                pass
            try:
                print(next(iterator))
            except StopIteration:
                pass
        """)


class BuiltinEnumerateFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "enumerate"
