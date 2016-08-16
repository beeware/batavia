from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class ListTests(TranspileTestCase):
    pass


class BuiltinListFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["list"]

    not_implemented = [
        'test_bytearray',
        'test_bytes',
        'test_complex',
        'test_dict',
        'test_frozenset',
        'test_NotImplemented',
        'test_range',
        'test_set',
    ]
