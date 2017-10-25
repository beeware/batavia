from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class BinTests(TranspileTestCase):
    def test_int_but_no_index(self):
        self.assertCodeExecution("""
            class IntLike:
                def __init__(self, val):
                    self.val = val
                def __int__(self):
                    return self.val

            x = IntLike(5)
            print(bin(x))
            """, run_in_function=False)


class BuiltinBinFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "bin"
