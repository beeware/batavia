from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class RoundTests(TranspileTestCase):
    pass


class BuiltinRoundFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["round"]

    not_implemented = [
        'test_bytearray',
        'test_bytes',
        'test_class',
        'test_complex',
        'test_dict',
        'test_frozenset',
        'test_list',
        'test_none',
        'test_set',
        'test_str',
        'test_tuple',
    ]
