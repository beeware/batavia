from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class FrozensetTests(TranspileTestCase):
    pass


class BuiltinFrozensetFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "frozenset"

    not_implemented = [
        'test_bool',
        'test_bytearray',
        'test_bytes',
        'test_dict',
        'test_range',
    ]
