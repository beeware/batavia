from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class RoundTests(TranspileTestCase):

    def test_all_bool(self):
        self.assertCodeExecution("""
            print(round(False,False))
            print(round(False,True))
            print(round(1234567890.23456,True))
            print(round(0,False))
            print(round(0,0))
            print(round(6546887689,0))
            print(round(6546887689,-12))
            print(round(654688.7689,-12))
        """)


class BuiltinRoundFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "round"

    not_implemented = [
        'test_int',
    ]
