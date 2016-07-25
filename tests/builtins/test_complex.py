from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class ComplexTests(TranspileTestCase):
    pass


class BuiltinComplexFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["complex"]

    not_implemented = [
        'test_bytearray',
        'test_bytes',
        'test_frozenset',
    ]
