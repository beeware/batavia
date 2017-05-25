from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class LenTests(TranspileTestCase):
    pass


class BuiltinLenFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["len"]

    not_implemented = [
        'test_bytearray',
    ]
