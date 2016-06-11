import unittest

from .utils import adjust, cleanse_javascript, cleanse_python, TranspileTestCase


class AdjustTests(unittest.TestCase):
    def assertEqualOutput(self, actual, expected):
        self.assertEqual(adjust(actual), adjust(expected))

    def test_adjust(self):
        "Test input can be stripped of leading spaces."
        self.assertEqual("""for i in range(0, 10):
    print('hello, world')
print('Done.')
""", adjust("""
            for i in range(0, 10):
                print('hello, world')
            print('Done.')
        """))

    def test_adjust_no_leading_space(self):
        self.assertEqual("""for i in range(0, 10):
    print('hello, world')
print('Done.')
""", adjust("""for i in range(0, 10):
    print('hello, world')
print('Done.')
"""))


class JavaScriptNormalizationTests(unittest.TestCase):
    def assertNormalized(self, actual, expected):
        self.assertEqual(cleanse_javascript(adjust(actual), None), adjust(expected))

    def test_no_exception(self):
        self.assertNormalized(
            """
            Hello, world.
            """,
            """
            Hello, world.
            """
        )

    def test_exception(self):
        self.assertNormalized(
            """
            Traceback (most recent call last):
              File "test.py", line 3, in <module>
            TypeError: unsupported operand type(s) for &: 'float' and 'bool'
            """,
            """
            ### EXCEPTION ###
            TypeError: unsupported operand type(s) for &: 'float' and 'bool'
                test.py:3
            """
        )

    def test_multi_frame_exception(self):
        self.assertNormalized(
            """
            Traceback (most recent call last):
              File "test.py", line 3, in <module>
              File "test.py", line 6, in <module>
              File "test.py", line 9, in <module>
            TypeError: unsupported operand type(s) for &: 'float' and 'bool'
            """,
            """
            ### EXCEPTION ###
            TypeError: unsupported operand type(s) for &: 'float' and 'bool'
                test.py:3
                test.py:6
                test.py:9
            """
        )

    def test_exception_with_other_text(self):
        self.assertNormalized(
            """
            Hello, world.
            Traceback (most recent call last):
              File "test.py", line 3, in <module>
            TypeError: unsupported operand type(s) for &: 'float' and 'bool'
            """,
            """
            Hello, world.
            ### EXCEPTION ###
            TypeError: unsupported operand type(s) for &: 'float' and 'bool'
                test.py:3
            """
        )

    def test_bool(self):
        self.assertNormalized('true', 'True')
        self.assertNormalized('false', 'False')

    def test_float(self):
        self.assertNormalized('7.950899459780156e-06', '7.950899459780156e-6')

    def test_memory_reference(self):
        self.assertNormalized(
            """
            Class is <class 'com.example.MyClass'>
            Method is <native function com.example.MyClass.method>
            Method from instance is <bound native method com.example.MyClass.method of <Native class com.example.MyClass object at 0x1eb19f4e>>
            Hello from the instance!
            Done.
            """,
            """
            Class is <class 'com.example.MyClass'>
            Method is <native function com.example.MyClass.method>
            Method from instance is <bound native method com.example.MyClass.method of <Native class com.example.MyClass object at 0xXXXXXXXX>>
            Hello from the instance!
            Done.
            """
        )


class PythonNormalizationTests(unittest.TestCase):
    def assertNormalized(self, actual, expected):
        self.assertEqual(cleanse_python(adjust(actual), None), adjust(expected))

    def test_no_exception(self):
        self.assertNormalized(
            """
            Hello, world.
            """,
            """
            Hello, world.
            """
        )

    def test_exception(self):
        self.assertNormalized(
            """
            Traceback (most recent call last):
              File "test.py", line 3, in <module>
                print(x & y)
            TypeError: unsupported operand type(s) for &: 'float' and 'bool'
            """,
            """
            ### EXCEPTION ###
            TypeError: unsupported operand type(s) for &: 'float' and 'bool'
                test.py:3
            """
        )

    def test_multi_frame_exception(self):
        self.assertNormalized(
            """
            Traceback (most recent call last):
              File "test.py", line 3, in <module>
                print(x & y)
              File "test.py", line 6, in <module>
                print(x & y)
              File "test.py", line 9, in <module>
                print(x & y)
            TypeError: unsupported operand type(s) for &: 'float' and 'bool'
            """,
            """
            ### EXCEPTION ###
            TypeError: unsupported operand type(s) for &: 'float' and 'bool'
                test.py:3
                test.py:6
                test.py:9
            """
        )

    def test_exception_with_other_text(self):
        self.assertNormalized(
            """
            Hello, world.
            Traceback (most recent call last):
              File "test.py", line 3, in <module>
                print(x & y)
            TypeError: unsupported operand type(s) for &: 'float' and 'bool'
            """,
            """
            Hello, world.
            ### EXCEPTION ###
            TypeError: unsupported operand type(s) for &: 'float' and 'bool'
                test.py:3
            """
        )

    def test_float(self):
        self.assertNormalized('7.950899459780156e-06', '7.950899459780156e-6')

    def test_memory_reference(self):
        self.assertNormalized(
            """
            Class is <class 'com.example.MyClass'>
            Method is <native function com.example.MyClass.method>
            Method from instance is <bound native method com.example.MyClass.method of <Native class com.example.MyClass object at 0x1eb19f4e>>
            Hello from the instance!
            Done.
            """,
            """
            Class is <class 'com.example.MyClass'>
            Method is <native function com.example.MyClass.method>
            Method from instance is <bound native method com.example.MyClass.method of <Native class com.example.MyClass object at 0xXXXXXXXX>>
            Hello from the instance!
            Done.
            """
        )


class JavaScriptBootstrapTests(TranspileTestCase):
    def test_js_code(self):
        "You can supply JavaScript code and use it from within Python"
        self.assertJavaScriptExecution(
            """
            from example import myfunc

            myfunc()

            print("Done.")
            """,
            js={
                'example': """
                example = function(mod) {

                    mod.myfunc = function() {
                        console.log("Hello from JavaScript function.");
                    };

                    return mod;
                }({});
                """
            },
            out="""
            Hello from JavaScript function.
            Done.
            """,
        )
