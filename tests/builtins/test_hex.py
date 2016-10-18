from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class HexTests(TranspileTestCase):
    def test_hex(self):
        self.assertCodeExecution("""
            print(hex(15))
            hex(3735928559)
            print(hex(373592855937359285593735928559373592855937359285593735928559))
            """)


class BuiltinHexFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["hex"]

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
