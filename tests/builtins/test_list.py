from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class ListTests(TranspileTestCase):
    pass


class BuiltinListFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["list"]

    not_implemented = [
        'test_bytearray',
        'test_complex',
        'test_NotImplemented'
    ]
