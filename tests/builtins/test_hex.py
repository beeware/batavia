from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class HexTests(TranspileTestCase):
    def test_hex(self):
        self.assertCodeExecution("""
            print(hex(15))
            print(hex(3735928559))
            print(hex(0xb2594c0a7500649c618b365c0663d9d8556be9784939edb663267c0a8288))
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
