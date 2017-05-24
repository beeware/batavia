from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class IterTests(TranspileTestCase):
    def test_iter_bytes(self):
        self.assertCodeExecution("""
            print(list(iter(b"")))
            print(list(iter(b"abcdefgh")))
            """)

    def test_iter_sentinel_range(self):
        self.assertCodeExecution("""
            seq = iter(range(10))
            callable = lambda: next(seq)
            result = iter(callable, 3)
            print(list(result))
        """)

    def test_iter_sentinel_repeated(self):
        self.assertCodeExecution("""
            seq = iter(range(10))
            callable = lambda: next(seq)
            iterator = iter(callable, 3)
            print(next(iterator))
            print(next(iterator))
            print(next(iterator))
            try:
                print(next(iterator))
            except StopIteration:
                pass
            try:
                print(next(iterator))
            except StopIteration:
                pass
        """)

    def test_iter_sentinel_gen(self):
        self.assertCodeExecution("""
            def gen():
                abc = 'abcdefghij'
                for letter in abc:
                    yield letter
                    
            g = gen()
            callable = lambda: next(g)
            result = iter(callable, 'd')
            print(list(result))
        """)


class BuiltinIterFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["iter"]

    not_implemented = [
        'test_noargs',
        'test_bytearray',
        'test_dict',
    ]
