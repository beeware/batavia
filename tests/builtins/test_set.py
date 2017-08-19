from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class SetTests(TranspileTestCase):
    pass


class BuiltinSetFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "set"

    not_implemented = [
        'test_bool',
        'test_bytearray',
        'test_bytes',
        'test_range',
    ]
