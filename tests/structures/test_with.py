from unittest import expectedFailure
from ..utils import TranspileTestCase


class WithTests(TranspileTestCase):
    def test_enter_exit(self):
        self.assertCodeExecution("""
            class mgr:
                def __enter__(self):
                    print('__enter__')
                def __exit__(self, exc_type, val, traceback):
                    print('__exit__')

            with mgr():
                print('inside')
        """)

    def test_return_from_enter(self):
        self.assertCodeExecution("""
            class mgr:
                def __enter__(self):
                    return 42
                def __exit__(self, exc, val, tb):
                    print('cleaning up')

            with mgr() as x:
                print(x)
        """)

    def test_raise(self):
        self.assertCodeExecution("""
            class mgr:
                def __enter__(self):
                    pass
                def __exit__(self, exc, val, tb):
                    print('cleaning up')

            try:
                with mgr():
                    print('inside')
                    raise Exception('oops')
                    print('done')
            except Exception as e:
                print(type(e), e)
        """)

    def test_suppress_exception(self):
        self.assertCodeExecution("""
            class mgr:
                def __enter__(self):
                    pass
                def __exit__(self, exc, val, tb):
                    print('supress')
                    return True

            with mgr():
                raise KeyError(42)
                print('raised')
            print('done')
        """)

    # There is no traceback class in batavia
    @expectedFailure
    def test_exit_args(self):
        self.assertCodeExecution("""
            class mgr:
                def __enter__(self):
                    pass
                def __exit__(self, exc, val, tb):
                    print('exc', type(exc), exc)
                    print('val', type(val), val)
                    print('tb', type(tb), tb)
                    return True

            with mgr():
                pass

            with mgr():
                raise Exception
        """)
