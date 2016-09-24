from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class IterTests(TranspileTestCase):
    def test_iter_bytes(self):
        self.assertCodeExecution("""
            print(list(iter(b"")))
            print(list(iter(b"abcdefgh")))
            """)



class BuiltinIterFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["iter"]

    not_implemented = [
        'test_bytearray',
        'test_complex',
        'test_dict',
        'test_NotImplemented',
    ]
