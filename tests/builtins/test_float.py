from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class FloatTests(TranspileTestCase):
    pass


class BuiltinFloatFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["float"]

    not_implemented = [
        'test_bool',
        'test_bytearray',
        'test_bytes',
        'test_class',
        'test_complex',
        'test_dict',
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
