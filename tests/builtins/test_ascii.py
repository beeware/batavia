from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class AsciiTests(TranspileTestCase):
    pass


class BuiltinAsciiFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["ascii"]

    not_implemented = [
        'test_class',
        'test_frozenset',
        'test_NotImplemented',
        'test_range',
        'test_slice',
    ]
