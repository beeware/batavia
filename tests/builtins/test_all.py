from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class AllTests(TranspileTestCase):
    pass


class BuiltinAllFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["all"]

    not_implemented = [
        'test_bool',
        'test_bytearray',
        'test_class',
        'test_complex',
        'test_float',
        'test_frozenset',
        'test_int',
        'test_list',
        'test_none',
        'test_set',
    ]
