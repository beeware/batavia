from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class ImportTests(TranspileTestCase):
    pass


class BuiltinImportFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["__import__"]

    not_implemented = [
        'test_bytearray',
        'test_complex',
        'test_dict',
        'test_frozenset',
        'test_set',
        'test_str',
    ]
