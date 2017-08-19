from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class FloatTests(TranspileTestCase):
    pass


class BuiltinFloatFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "float"

    not_implemented = [
        'test_bytearray',
        'test_bytes',
        'test_complex',
    ]
