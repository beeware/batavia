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


class NativeImportTests(TranspileTestCase):
    def test_import_module(self):
        "You can import a module implemented in Javascript"
        self.assertJavaScriptExecution(
            """
            import example

            example.some_method()

            print("Done.")
            """,
            js={
                'example':
                    """
                    example = function(mod) {
                        console.log("Now we're in the example module");

                        mod.some_method = function() {
                            console.log("Now we're calling a module method");
                        }
                        return mod;
                    }({});
                    """
            },
            out="""
            Now we're in the example module
            Now we're calling a module method
            Done.
            """)

    def test_multiple_module_import(self):
        "You can import a multiple Python modules implemented in Python"
        self.assertJavaScriptExecution(
            """
            import example, other

            example.some_method()

            other.other_method()

            print("Done.")
            """,
            js={
                'example':
                    """
                    example = function(mod) {
                        console.log("Now we're in the example module");

                        mod.some_method = function() {
                            console.log("Now we're calling a module method");
                        }
                        return mod;
                    }({});
                    """,
                'other':
                    """
                    other = function(mod) {
                        console.log("Now we're in the other module");

                        mod.other_method = function() {
                            console.log("Now we're calling another module method");
                        }
                        return mod;
                    }({});
                    """
            },
            out="""
            Now we're in the example module
            Now we're in the other module
            Now we're calling a module method
            Now we're calling another module method
            Done.
            """)

    def test_full_dotted_path(self):
        self.assertJavaScriptExecution(
            """
            import example.submodule

            example.submodule.some_method()

            print("Done.")
            """,
            js={
                'example':
                    """
                    example = function(mod) {
                        console.log("Now we're in the example module");
                        return mod;
                    }({});
                    """,
                'example.submodule':
                    """
                    example.submodule = function(mod) {
                        console.log("Now we're in example.submodule");

                        mod.some_method = function() {
                            console.log("Now we're calling a submodule method");
                        }
                        return mod;
                    }({});
                    """
            },
            out="""
            Now we're in the example module
            Now we're in example.submodule
            Now we're calling a submodule method
            Done.
            """)

    def test_module_from_dotted_path(self):
        self.assertJavaScriptExecution(
            """
            from example import submodule

            submodule.some_method()

            print("Done.")
            """,
            js={
                'example':
                    """
                    example = function(mod) {
                        console.log("Now we're in the example module");
                        return mod;
                    }({});
                    """,
                'example.submodule':
                    """
                    example.submodule = function(mod) {
                        console.log("Now we're in example.submodule");

                        mod.some_method = function() {
                            console.log("Now we're calling a submodule method");
                        }
                        return mod;
                    }({});
                    """
            },
            out="""
            Now we're in the example module
            Now we're in example.submodule
            Now we're calling a submodule method
            Done.
            """)

    def test_symbol_from_dotted_path(self):
        self.assertJavaScriptExecution(
            """
            from example.submodule import some_method

            some_method()

            print("Done.")
            """,
            js={
                'example':
                    """
                    example = function(mod) {
                        console.log("Now we're in the example module");
                        return mod;
                    }({});
                    """,
                'example.submodule':
                    """
                    example.submodule = function(mod) {
                        console.log("Now we're in example.submodule");

                        mod.some_method = function() {
                            console.log("Now we're calling a submodule method");
                        }
                        return mod;
                    }({});
                    """
            },
            out="""
            Now we're in the example module
            Now we're in example.submodule
            Now we're calling a submodule method
            Done.
            """)

    def test_full_deep_dotted_path(self):
        self.assertJavaScriptExecution(
            """
            import example.submodule.subsubmodule.another

            example.submodule.subsubmodule.another.another_method()

            print("Done.")
            """,
            js={
                'example':
                    """
                    example = function(mod) {
                        console.log("Now we're in the example module");
                        return mod;
                    }({});
                    """,
                'example.submodule':
                    """
                    example.submodule = function(mod) {
                        console.log("Now we're in example.submodule");
                        return mod;
                    }({});
                    """,
                'example.submodule.other':
                    """
                    example.submodule.other = function(mod) {
                        console.log("Now we're in example.submodule.other");

                        mod.some_method = function() {
                            console.log("Now we're calling a submodule method");
                        }
                        return mod;
                    }({});
                    """,
                'example.submodule.subsubmodule':
                    """
                    example.submodule.subsubmodule = function(mod) {
                        console.log("Now we're in example.submodule.subsubmodule");
                        return mod;
                    }({});
                    """,
                'example.submodule.subsubmodule.another':
                    """
                    example.submodule.subsubmodule.another = function(mod) {
                        console.log("Now we're in example.submodule.subsubmodule.another");

                        mod.another_method = function() {
                            console.log("Now we're calling a subsubmodule method");
                        }
                        return mod;
                    }({});
                    """
            },
            out="""
            Now we're in the example module
            Now we're in example.submodule
            Now we're in example.submodule.other
            Now we're in example.submodule.subsubmodule
            Now we're in example.submodule.subsubmodule.another
            Now we're calling a subsubmodule method
            Done.
            """)

    def test_module_from_deep_dotted_path(self):
        self.assertJavaScriptExecution(
            """
            from example.submodule.subsubmodule import another

            another.another_method()

            print("Done.")
            """,
            js={
                'example':
                    """
                    example = function(mod) {
                        console.log("Now we're in the example module");
                        return mod;
                    }({});
                    """,
                'example.submodule':
                    """
                    example.submodule = function(mod) {
                        console.log("Now we're in example.submodule");
                        return mod;
                    }({});
                    """,
                'example.submodule.other':
                    """
                    example.submodule.other = function(mod) {
                        console.log("Now we're in example.submodule.other");

                        mod.some_method = function() {
                            console.log("Now we're calling a submodule method");
                        }
                        return mod;
                    }({});
                    """,
                'example.submodule.subsubmodule':
                    """
                    example.submodule.subsubmodule = function(mod) {
                        console.log("Now we're in example.submodule.subsubmodule");
                        return mod;
                    }({});
                    """,
                'example.submodule.subsubmodule.another':
                    """
                    example.submodule.subsubmodule.another = function(mod) {
                        console.log("Now we're in example.submodule.subsubmodule.another");

                        mod.another_method = function() {
                            console.log("Now we're calling a subsubmodule method");
                        }
                        return mod;
                    }({});
                    """
            },
            out="""
            Now we're in the example module
            Now we're in example.submodule
            Now we're in example.submodule.other
            Now we're in example.submodule.subsubmodule
            Now we're in example.submodule.subsubmodule.another
            Now we're calling a subsubmodule method
            Done.
            """)

    def test_symbol_from_deep_dotted_path(self):
        self.assertJavaScriptExecution(
            """
            from example.submodule.subsubmodule.another import another_method

            another_method()

            print("Done.")
            """,
            js={
                'example':
                    """
                    example = function(mod) {
                        console.log("Now we're in the example module");
                        return mod;
                    }({});
                    """,
                'example.submodule':
                    """
                    example.submodule = function(mod) {
                        console.log("Now we're in example.submodule");
                        return mod;
                    }({});
                    """,
                'example.submodule.other':
                    """
                    example.submodule.other = function(mod) {
                        console.log("Now we're in example.submodule.other");

                        mod.some_method = function() {
                            console.log("Now we're calling a submodule method");
                        }
                        return mod;
                    }({});
                    """,
                'example.submodule.subsubmodule':
                    """
                    example.submodule.subsubmodule = function(mod) {
                        console.log("Now we're in example.submodule.subsubmodule");
                        return mod;
                    }({});
                    """,
                'example.submodule.subsubmodule.another':
                    """
                    example.submodule.subsubmodule.another = function(mod) {
                        console.log("Now we're in example.submodule.subsubmodule.another");

                        mod.another_method = function() {
                            console.log("Now we're calling a subsubmodule method");
                        }
                        return mod;
                    }({});
                    """
            },
            out="""
            Now we're in the example module
            Now we're in example.submodule
            Now we're in example.submodule.other
            Now we're in example.submodule.subsubmodule
            Now we're in example.submodule.subsubmodule.another
            Now we're calling a subsubmodule method
            Done.
            """)

    def test_symbol_import(self):
        self.assertJavaScriptExecution(
            """
            from example import some_method

            some_method()

            print("Done.")
            """,
            js={
                'example':
                    """
                    example = function(mod) {
                        console.log("Now we're in the example module");

                        mod.some_method = function() {
                            console.log("Now we're calling a module method");
                        }
                        return mod;
                    }({});
                    """
            },
            out="""
            Now we're in the example module
            Now we're calling a module method
            Done.
            """)

    def test_multiple_symbol_import(self):
        self.assertJavaScriptExecution(
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
            js={
                'example':
                    """
                    example = function(mod) {
                        console.log("Now we're in the example module");

                        mod.some_method = function() {
                            console.log("Now we're calling a module method");
                        }

                        mod.other_method = function() {
                            console.log("Now we're calling another method");
                        }

                        mod.third_method = function() {
                            console.log("Now we're calling a third method");
                        }

                        return mod;
                    }({});
                    """
            },
            out="""
            Now we're in the example module
            Call some method...
            Now we're calling a module method
            Call another method...
            Now we're calling another method
            But this will fail...
            Which it does.
            Done.
            """)

    def test_import_star(self):
        self.assertJavaScriptExecution(
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
            js={
                'example':
                    """
                    example = function(mod) {
                        console.log("Now we're in the example module");

                        mod.some_method = function() {
                            console.log("Now we're calling a module method");
                        }

                        mod.other_method = function() {
                            console.log("Now we're calling another method");
                        }

                        mod.third_method = function() {
                            console.log("Now we're calling a third method");
                        }

                        return mod;
                    }({});
                    """
            },
            out="""
            Now we're in the example module
            Call some method...
            Now we're calling a module method
            Call another method...
            Now we're calling another method
            Call a third method...
            Now we're calling a third method
            Done.
            """,
            run_in_function=False)

    def test_symbol_import_class(self):
        self.assertJavaScriptExecution(
            """
            from example import MyClass

            obj = MyClass(1, 2, 3)
            obj.doStuff(4, 5, 6)

            print("Done.")
            """,
            js={
                'example':
                    """
                    example = function(mod) {
                        console.log("Now we're in the example module");

                        mod.MyClass = function(x, y, z) {
                            console.log("Now we're in the constructor " + x + ' ' + y + ' ' + z);
                            this.x = x;
                            this.y = y;
                            this.z = z;
                        };

                        mod.MyClass.prototype.doStuff = function(a, b, c) {
                            console.log("first: " + a + ' ' + this.x + ' ' + (a + this.x));
                            console.log("second: " + b + ' ' + this.y + ' ' + (b + this.y));
                            console.log("third: " + c + ' ' + this.z + ' ' + (c + this.z));
                        };

                        return mod;
                    }({});
                    """
            },
            out="""
            Now we're in the example module
            Now we're in the constructor 1 2 3
            first: 4 1 5
            second: 5 2 7
            third: 6 3 9
            Done.
            """)

    def test_module_import_class(self):
        self.assertJavaScriptExecution(
            """
            import example

            obj = example.MyClass(1, 2, 3)
            obj.doStuff(4, 5, 6)

            print("Done.")
            """,
            js={
                'example':
                    """
                    example = function(mod) {
                        console.log("Now we're in the example module");

                        mod.MyClass = function(x, y, z) {
                            console.log("Now we're in the constructor " + x + ' ' + y + ' ' + z);
                            this.x = x;
                            this.y = y;
                            this.z = z;
                        };

                        mod.MyClass.prototype.doStuff = function(a, b, c) {
                            console.log("first: " + a + ' ' + this.x + ' ' + (a + this.x));
                            console.log("second: " + b + ' ' + this.y + ' ' + (b + this.y));
                            console.log("third: " + c + ' ' + this.z + ' ' + (c + this.z));
                        };

                        return mod;
                    }({});
                    """
            },
            out="""
            Now we're in the example module
            Now we're in the constructor 1 2 3
            first: 4 1 5
            second: 5 2 7
            third: 6 3 9
            Done.
            """)
