from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class RoundTests(TranspileTestCase):
    pass


class BuiltinRoundFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "round"

    not_implemented = [
        'test_noargs',
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
