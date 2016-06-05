from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class BinTests(TranspileTestCase):
    pass


class BuiltinBinFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["bin"]

    not_implemented = [
        'test_bool',
        'test_bytearray',
        'test_class',
        'test_complex',
        'test_frozenset',
        'test_int',
    ]
