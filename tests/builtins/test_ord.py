from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class OrdTests(TranspileTestCase):
    pass


class BuiltinOrdFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["ord"]

    not_implemented = [
        'test_bytearray',
        'test_bytes',
        'test_class',
        'test_complex',
        'test_frozenset',
        'test_str',
    ]
