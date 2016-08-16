from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class TupleTests(TranspileTestCase):
    pass


class BuiltinTupleFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["tuple"]

    not_implemented = [
        'test_bytearray',
        'test_bytes',
        'test_complex',
        'test_dict',
        'test_frozenset',
        'test_NotImplemented',
        'test_range',
        'test_set',
    ]
