from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class AllTests(TranspileTestCase):
    pass


class BuiltinAllFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["all"]

    not_implemented = [
        'test_bytearray',
        'test_class',
        'test_complex',
        'test_dict',
        'test_frozenset',
    ]
