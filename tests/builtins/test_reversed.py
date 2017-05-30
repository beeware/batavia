from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class ReversedTests(TranspileTestCase):
    
    def test_reversed_list(self):
        self.assertCodeExecution("""
            print(list(reversed([1,2,3])))
        """)

    def test_reversed_dunder_reversed(self):
        self.assertCodeExecution("""
            class Foo(object):
                def __reversed__(self):
                    return iter([1, 2, 3])
                    
            f = Foo()
            print(list(reversed(f)))
        """)


class BuiltinReversedFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["reversed"]

    not_implemented = [
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
