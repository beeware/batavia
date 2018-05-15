from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class FloatTests(TranspileTestCase):
    def test_can_parse_negative_1(self):
        self.assertCodeExecution("""
            print(float("-1"))
            """)


class BuiltinFloatFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "float"
