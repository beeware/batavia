from .. utils import TranspileTestCase, BuiltinFunctionTestCase

import unittest


class TypeTests(TranspileTestCase):
    pass


class BuiltinTypeFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "type"

    @unittest.expectedFailure
    def test_type_equality(self):
        self.assertCodeExecution("""
        print(type(123))
        print(type(123) == int)
        """)
