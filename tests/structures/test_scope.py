from ..utils import TranspileTestCase

import unittest


class ScopeTests(TranspileTestCase):
    def test_simple(self):
        # This test will run both in global scope, and in a
        # function.
        self.assertCodeExecution("""
            x = 1
            print('x =', x)
            print('Done.')
            """)

    def test_local_scope(self):
        self.assertCodeExecution("""
            x = 1

            def foo():
                print("1: x =", x)
                x = 2
                print("2: x =", x)

            print("3: x =", x)
            foo()
            print("4: x =", x)

            print('Done.')
            """, run_in_function=False)

    def test_global_scope(self):
        self.assertCodeExecution("""
            x = 1

            def foo():
                global x
                print("1: x =", x)
                x = 2
                print("2: x =", x)

            print("3: x =", x)
            foo()
            print("4: x =", x)

            print('Done.')
            """, run_in_function=False)

    def test_class_scope(self):
        self.assertCodeExecution("""
            x = 1

            class Foo:
                def __init__(self, y):
                    print("1: x =", x)
                    print("1: y =", y)
                    x = 2
                    print("2: x =", x)
                    print("2: y =", y)

            print("3: x =", x)
            f = Foo(3)
            print("4: x =", x)

            print('Done.')
            """, run_in_function=False)

    def test_module_globals(self):
        self.assertCodeExecution(
            """
            from example import do_first

            do_first('hello')

            print("Done.")
            """,
            extra_code={
                'example':
                    """
                    print("Initializing the example module")
                    c = 42

                    def do_second(x):
                        print("The second thing...", x)
                        print("The value of c is", c)

                    def do_first(x):
                        print("The first thing...", x)
                        do_second(x)

                    """,
            })
