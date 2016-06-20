from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class AllTests(TranspileTestCase):
    pass


class BuiltinAllFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["all"]

    not_implemented = [
        'test_bytearray',
        'test_dict',
        'test_complex',
        'test_frozenset',
        'test_None',
        'test_NotImplemented',
        'test_range',
    ]
