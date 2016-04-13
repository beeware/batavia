import os

from ..utils import TranspileTestCase

import unittest


class ImportTests(TranspileTestCase):
    @unittest.expectedFailure
    def test_import_stdlib_module(self):
        "You can import a Python module implemented in Java (a native stdlib shim)"
        self.assertCodeExecution(
            """
            import time

            time.time()

            print("Done.")
            """)

    @unittest.expectedFailure
    def test_import_module(self):
        "You can import a Python module implemented in Python"
        self.assertCodeExecution(
            """
            import example

            example.some_method()

            print("Done.")
            """,
            extra_code={
                'example':
                    """
                    print("Now we're in the example module")

                    def some_method():
                        print("Now we're calling a module method")
                    """
            })

    @unittest.expectedFailure
    def test_multiple_module_import(self):
        "You can import a multiple Python modules implemented in Python"
        self.assertCodeExecution(
            """
            import example, other

            example.some_method()

            other.other_method()

            print("Done.")
            """,
            extra_code={
                'example':
                    """
                    print("Now we're in the example module")

                    def some_method():
                        print("Now we're calling a module method")
                    """,
                'other':
                    """
                    print("Now we're in the other module")

                    def other_method():
                        print("Now we're calling another module method")
                    """
            })

    @unittest.expectedFailure
    def test_full_dotted_path(self):
        self.assertCodeExecution(
            """
            import example.submodule

            example.submodule.some_method()

            print("Done.")
            """,
            extra_code={
                'example.__init__':
                    """
                    print("Initializing the example module")
                    """,
                'example.submodule':
                    """
                    print("Now we're in example.submodule")

                    def some_method():
                        print("Now we're calling a submodule method")
                    """
            })

    @unittest.expectedFailure
    def test_module_from_dotted_path(self):
        self.assertCodeExecution(
            """
            from example import submodule

            submodule.some_method()

            print("Done.")
            """,
            extra_code={
                'example.__init__':
                    """
                    print("Initializing the example module")
                    """,
                'example.submodule':
                    """
                    print("Now we're in example.submodule")

                    def some_method():
                        print("Now we're calling a submodule method")
                    """
            })

    @unittest.expectedFailure
    def test_symbol_from_dotted_path(self):
        self.assertCodeExecution(
            """
            from example.submodule import some_method

            some_method()

            print("Done.")
            """,
            extra_code={
                'example.__init__':
                    """
                    print("Initializing the example module")
                    """,
                'example.submodule':
                    """
                    print("Now we're in example.submodule")

                    def some_method():
                        print("Now we're calling a submodule method")
                    """
            })

    @unittest.expectedFailure
    def test_full_deep_dotted_path(self):
        self.assertCodeExecution(
            """
            import example.submodule.subsubmodule.another

            example.submodule.subsubmodule.another.another_method()

            print("Done.")
            """,
            extra_code={
                'example.__init__':
                    """
                    print("Initializing the example module")
                    """,
                'example.submodule.__init__':
                    """
                    print("Now we're in example.submodule.__init__")
                    """,
                'example.submodule.other':
                    """
                    print("Now we're in example.submodule.other")

                    def other_method():
                        print("Now we're calling a submodule method")
                    """,
                'example.submodule.subsubmodule.__init__':
                    """
                    print("Now we're in example.submodule.subsubmodule.__init__")
                    """,
                'example.submodule.subsubmodule.another':
                    """
                    print("Now we're in example.submodule.subsubmodule.another")

                    def another_method():
                        print("Now we're calling a subsubmodule method")
                    """
            })

    @unittest.expectedFailure
    def test_module_from_deep_dotted_path(self):
        self.assertCodeExecution(
            """
            from example.submodule.subsubmodule import another

            another.another_method()

            print("Done.")
            """,
            extra_code={
                'example.__init__':
                    """
                    print("Initializing the example module")
                    """,
                'example.submodule.__init__':
                    """
                    print("Now we're in example.submodule.__init__")
                    """,
                'example.submodule.other':
                    """
                    print("Now we're in example.submodule.other")

                    def other_method():
                        print("Now we're calling a submodule method")
                    """,
                'example.submodule.subsubmodule.__init__':
                    """
                    print("Now we're in example.submodule.subsubmodule.__init__")
                    """,
                'example.submodule.subsubmodule.another':
                    """
                    print("Now we're in example.submodule.subsubmodule.another")

                    def another_method():
                        print("Now we're calling a subsubmodule method")
                    """
            })

    @unittest.expectedFailure
    def test_symbol_from_deep_dotted_path(self):
        self.assertCodeExecution(
            """
            from example.submodule.subsubmodule.another import another_method

            another_method()

            print("Done.")
            """,
            extra_code={
                'example.__init__':
                    """
                    print("Initializing the example module")
                    """,
                'example.submodule.__init__':
                    """
                    print("Now we're in example.submodule.__init__")
                    """,
                'example.submodule.other':
                    """
                    print("Now we're in example.submodule.other")

                    def other_method():
                        print("Now we're calling a submodule method")
                    """,
                'example.submodule.subsubmodule.__init__':
                    """
                    print("Now we're in example.submodule.subsubmodule.__init__")
                    """,
                'example.submodule.subsubmodule.another':
                    """
                    print("Now we're in example.submodule.subsubmodule.another")

                    def another_method():
                        print("Now we're calling a subsubmodule method")
                    """
            })

    @unittest.expectedFailure
    def test_symbol_import(self):
        self.assertCodeExecution(
            """
            from example import some_method

            some_method()

            print("Done.")
            """,
            extra_code={
                'example':
                    """
                    print("Now we're in the example module")

                    def some_method():
                        print("Now we're calling a module method")
                    """
            })

    @unittest.expectedFailure
    def test_multiple_symbol_import(self):
        self.assertCodeExecution(
            """
            from example import some_method, other_method

            print("Call some method...")
            some_method()

            print("Call another method...")
            other_method()

            try:
                print("But this will fail...")
                third_method()
            except NameError:
                print("Which it does.")

            print("Done.")
            """,
            extra_code={
                'example':
                    """
                    print("Now we're in the example module")

                    def some_method():
                        print("Now we're calling a module method")

                    def other_method():
                        print("Now we're calling another module method")

                    def third_method():
                        print("This shouldn't be called")

                    """
            })

    @unittest.expectedFailure
    def test_import_star(self):
        self.assertCodeExecution(
            """
            from example import *

            print("Call some method...")
            some_method()

            print("Call another method...")
            other_method()

            print("Call a third method...")
            third_method()

            print("Done.")
            """,
            extra_code={
                'example':
                    """
                    print("Now we're in the example module")

                    def some_method():
                        print("Now we're calling a module method")

                    def other_method():
                        print("Now we're calling another module method")

                    def third_method():
                        print("Now we're calling a third module method")

                    """
            }, run_in_function=False)

    @unittest.expectedFailure
    def test_import_star_with_all(self):
        self.assertCodeExecution(
            """
            from example import *

            print("Call some method...")
            some_method()

            print("Call another method...")
            other_method()

            try:
                print("But this will fail...")
                third_method()
            except NameError:
                print("Which it does.")

            print("Done.")
            """,
            extra_code={
                'example':
                    """
                    __all__ = ['some_method', 'other_method']

                    print("Now we're in the example module")

                    def some_method():
                        print("Now we're calling a module method")

                    def other_method():
                        print("Now we're calling another module method")

                    def third_method():
                        print("This shouldn't be called")

                    """
            }, run_in_function=False)
