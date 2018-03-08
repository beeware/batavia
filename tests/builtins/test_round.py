from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class RoundTests(TranspileTestCase):

    def test_all_bool(self):
        self.assertCodeExecution("""
            print(round(False,False))
        """)

    def test_diff_bool(self):
        self.assertCodeExecution("""
            print(round(False,True))
        """)
    def test_float_bool(self):
        self.assertCodeExecution("""
            print(round(1234567890.23456,True))
        """)

    def test_zero_bool(self):
        self.assertCodeExecution("""
            print(round(0,False))
        """)
    def test_zero_zero(self):
        self.assertCodeExecution("""
            print(round(0,0))
        """)
    def test_int_zero(self):
        self.assertCodeExecution("""
            print(round(6546887689,0))
        """)
    def test_int_neg(self):
        self.assertCodeExecution("""
            print(round(6546887689,-12))
        """)
    def test_float_neg(self):
        self.assertCodeExecution("""
            print(round(654688.7689,-12))
        """)


class BuiltinRoundFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "round"

    not_implemented = [
        'test_int',
    ]
