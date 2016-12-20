from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class RangeTests(TranspileTestCase):

    def test_range_one_argument(self):
        self.assertCodeExecution("""
            print(range(10))
        """)

    def test_range_two_arguments(self):
        self.assertCodeExecution("""
            print(range(5, 10))
        """)

    def test_range_three_arguments(self):
        self.assertCodeExecution("""
            print(range(10, 20, 2))
        """)

class BuiltinRangeFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["range"]

    not_implemented = [
        'test_noargs',
        'test_bool',
        'test_bytearray',
        'test_bytes',
        'test_class',
        'test_complex',
        'test_dict',
        'test_float',
        'test_frozenset',
        'test_list',
        'test_None',
        'test_NotImplemented',
        'test_range',
        'test_set',
        'test_slice',
        'test_str',
        'test_tuple',
    ]
