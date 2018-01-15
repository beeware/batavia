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

    def test_repr_custom_class(self):
        self.assertCodeExecution("""
            class A:
                def __repr__(self):
                    return "Mÿ hôvèrçràft îß fûłl öf éêlś"
            print(repr(A()))
            """)


class BuiltinReprFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "repr"

    not_implemented = [
        'test_noargs',
    ]
