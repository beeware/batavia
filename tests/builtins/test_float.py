from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class FloatTests(TranspileTestCase):
    def test_infinity(self):
        self.assertCodeExecution("""
            print(float('inf'))
            print(float('-inf'))
            print(float('infinity'))
            print(float('-infinity'))
            print(float('Infinity'))
            print(float('-Infinity'))
        """)


class BuiltinFloatFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "float"

    not_implemented = [
        'test_bytearray',
        'test_bytes',
        'test_complex',
    ]
