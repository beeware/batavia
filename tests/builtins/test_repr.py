from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class ReprTests(TranspileTestCase):
    pass


class BuiltinReprFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["repr"]

    not_implemented = [
        'test_bytearray',
        'test_bytes',
        'test_class',
        'test_complex',
        'test_dict',
        'test_frozenset',
        'test_set',
    ]
