from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class SetTests(TranspileTestCase):
    pass


class BuiltinSetFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["set"]

    not_implemented = [
        'test_bool',
        'test_bytearray',
        'test_bytes',
        'test_range',
        'test_str',
        'test_tuple',
    ]
