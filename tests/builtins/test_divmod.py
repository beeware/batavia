from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class DivmodTests(TranspileTestCase):
    pass


class BuiltinDivmodFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["divmod"]

    not_implemented = [
        'test_bytearray',
        'test_class',
        'test_complex',
        'test_frozenset',
    ]
