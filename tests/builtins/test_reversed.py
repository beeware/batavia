from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class ReversedTests(TranspileTestCase):
    
    def test_reverse_list(self):
        self.assertCodeExecution("""
            print(list(reversed([1,2,3])))
        """)


class BuiltinReversedFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["reversed"]

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
        'test_int',
        'test_list',
        'test_None',
        'test_NotImplemented',
        'test_range',
        'test_set',
        'test_slice',
        'test_str',
        'test_tuple',
    ]
