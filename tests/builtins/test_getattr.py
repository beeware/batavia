from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class GetattrTests(TranspileTestCase):
    pass


class BuiltinGetattrFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["getattr"]

    not_implemented = [
        'test_bytearray',
        'test_complex',
        'test_frozenset',
        'test_None',
    ]
