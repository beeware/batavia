from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class LenTests(TranspileTestCase):
    def test_len_class(self):
        self.assertCodeExecution("""
            class Foo(object):
                def __len__(self):
                    return 42

            f = Foo()
            print(len(f))
        """)


class BuiltinLenFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "len"
