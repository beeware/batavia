from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class PrintTests(TranspileTestCase):
    def test_buffering(self):
        self.assertCodeExecution("""
            print('1: hello', ' world')
            print('2: hello\\n', 'world')
            print('3: hello', ' world\\n')
            print('4: hello\\nworld')
            print('5: hello\\nworld\\n')
            print('Done.')
            """)

    def test_fileobj(self):
        self.assertCodeExecution("""
            class FileLikeObject:
                def __init__(self):
                    self.buffer = ''

                def write(self, content):
                    self.buffer = self.buffer + (content * 2)

            out = FileLikeObject()

            print('hello', 'world', file=out)
            print('goodbye', 'world', file=out)
            print('---')
            print(out.buffer)
            print('Done.')
            """)

    def test_sep(self):
        self.assertCodeExecution("""
            print('hello world', 'goodbye world', sep='-')
            print('Done.')
            """)

    def test_end(self):
        self.assertCodeExecution("""
            print('hello world', 'goodbye world', end='-')
            print('Done.')
            """)

    def test_flush(self):
        self.assertCodeExecution("""
            print('hello world', 'goodbye world', flush=True)
            print('Done.')
            """)

    def test_empty(self):
        self.assertCodeExecution("""
            print()
            print('Done.')
            """)

    def test_combined(self):
        self.assertCodeExecution("""
            class FileLikeObject:
                def __init__(self):
                    self.buffer = ''

                def write(self, content):
                    self.buffer = self.buffer + (content * 2)

                def flush(self):
                    self.buffer = self.buffer + '<<<'

            out = FileLikeObject()

            print('hello', 'world', sep='*', end='-', file=out, flush=True)
            print('goodbye', 'world', file=out, sep='-', end='*')
            print('---')
            print(out.buffer)
            print('Done.')
            """)


class BuiltinPrintFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "print"
    operation = 'f("|||", x)'
