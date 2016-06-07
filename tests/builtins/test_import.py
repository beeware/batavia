from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class ImportTests(TranspileTestCase):
    pass


class BuiltinImportFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["__import__"]

    not_implemented = [
        'test_bytearray',
        'test_class',
        'test_complex',
        'test_frozenset',
        'test_str',
    ]
