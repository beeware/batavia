from .. utils import TranspileTestCase, BuiltinFunctionTestCase

import unittest

class IsinstanceTests(TranspileTestCase):
    def test_not_str(self):
        self.assertCodeExecution("""
        class A:
            pass
        print(isinstance(A(), str))
        """)

    def test_common_types(self):
        self.assertCodeExecution("""
        print(isinstance(1, int))
        print(isinstance(1.0, int))
        print(isinstance(1.0, float))
        print(isinstance(True, bool))
        print(isinstance("a", str))
        """)

    @unittest.expectedFailure
    def test_type_equality(self):
        self.assertCodeExecution("""
        print(isinstance(123, int))

        class A:
            pass
        a = A()
        print(isinstance(a, A))
        print(isinstance(a, object))
        """)


class BuiltinIsinstanceFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "isinstance"
