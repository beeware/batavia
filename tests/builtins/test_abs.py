from unittest import expectedFailure

from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class AbsTests(TranspileTestCase):
    @expectedFailure
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
        'test_bytes',
        'test_class',
        'test_complex',
    ]
