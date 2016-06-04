from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class MaxTests(TranspileTestCase):
    pass


class BuiltinMaxFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["max"]

    not_implemented = [
        'test_bytearray',
        'test_bytes',
        'test_class',
        'test_complex',
        'test_dict',
        'test_float',
        'test_frozenset',
        'test_int',
        'test_list',
        'test_none',
        'test_set',
        'test_str',
        'test_tuple',
    ]
