from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class ReprTests(TranspileTestCase):
    def test_hovercraft_full_of_eels(self):
        self.assertCodeExecution("""
            print(repr("Mÿ hôvèrçràft îß fûłl öf éêlś"))
            """)

    def test_repr_escape(self):
        self.assertCodeExecution("""
            print(repr("".join(chr(x) for x in range(128))))
            """)


class BuiltinReprFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["repr"]

    not_implemented = [
        'test_noargs',
        'test_class',
        'test_NotImplemented',
        'test_slice',
    ]
