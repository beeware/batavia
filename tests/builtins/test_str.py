from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class StrTests(TranspileTestCase):
    pass


class BuiltinStrFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["str"]

    not_implemented = [
        'test_bytearray',
        'test_bytes',
        'test_class',
        'test_complex',
        'test_dict',
        'test_frozenset',
        'test_set',
    ]
