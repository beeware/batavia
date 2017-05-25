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
    functions = ["enumerate"]

    not_implemented = [
        'test_noargs',
        'test_bool',
        'test_class',
        'test_complex',
        'test_float',
        'test_int',
        'test_None',
        'test_NotImplemented',
        'test_slice',
    ]
