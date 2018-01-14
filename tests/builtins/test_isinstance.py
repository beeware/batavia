from .. utils import TranspileTestCase, BuiltinFunctionTestCase

import unittest

class IsinstanceTests(TranspileTestCase):
    pass


class BuiltinIsinstanceFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "isinstance"

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
