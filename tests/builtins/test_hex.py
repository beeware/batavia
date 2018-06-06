from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class HexTests(TranspileTestCase):
    def test_hex(self):
        self.assertCodeExecution("""
            print(hex(15))
            print(hex(3735928559))
            print(hex(0xb2594c0a7500649c618b365c0663d9d8556be9784939edb663267c0a8288))
            """)


class BuiltinHexFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "hex"
