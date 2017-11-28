from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class StrTests(TranspileTestCase):
    def test_escape(self):
        self.assertCodeExecution("""
            print(str("".join(chr(x) for x in range(128))))
            """)


class BuiltinStrFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "str"
