from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class IterTests(TranspileTestCase):
    pass


class BuiltinIterFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["iter"]

    not_implemented = [
        'test_bytearray',
        'test_bytes',
        'test_complex',
        'test_dict',
        'test_frozenset',
        'test_None',
        'test_NotImplemented',
    ]
