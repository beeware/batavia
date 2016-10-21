from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class BytesTests(TranspileTestCase):
    pass


class BuiltinBytesFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["bytes"]
    small_ints = True

    not_implemented = [
        'test_bytearray',
    ]
