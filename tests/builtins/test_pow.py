from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class PowTests(TranspileTestCase):
    pass


class BuiltinPowFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["pow"]

    not_implemented = [
        'test_bytearray',
        'test_complex',
        'test_frozenset',
    ]
