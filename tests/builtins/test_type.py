from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class TypeTests(TranspileTestCase):
    pass


class BuiltinTypeFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "type"

    def test_type_equality(self):
        self.assertCodeExecution("""
        print(type(123))
        print(type(123) == int)
        """)
