from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class DelattrTests(TranspileTestCase):
    pass


class BuiltinDelattrFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["delattr"]

    not_implemented = [
        'test_bytearray',
        'test_complex',
        'test_dict',
        'test_frozenset',
        'test_none',
        'test_set',
    ]
