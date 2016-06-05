from unittest import expectedFailure

from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class AbsTests(TranspileTestCase):
    def test_abs_not_implemented(self):
        self.assertCodeExecution("""
            class NotAbsLike:
                pass
            x = NotAbsLike()
            print(abs(x))
            """)


class BuiltinAbsFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["abs"]

    not_implemented = [
        'test_bytearray',
        'test_complex',
    ]
