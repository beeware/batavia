import unittest

from .utils import adjust, JSCleaner, PYCleaner, TranspileTestCase


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
    def assertNormalized(self, actual, expected, js_cleaner=JSCleaner()):
        self.assertEqual(js_cleaner.cleanse(adjust(actual), None), adjust(expected))

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
        self.assertNormalized('7.95089e-06', '7.95089e-6')
        self.assertNormalized('7.950899e-06', '7.95089...e-6')
        self.assertNormalized('7.950899459780156e-06', '7.95089...e-6')

        self.assertNormalized('0.000002653582035', '2.65358...e-6')
        self.assertNormalized('321956420358983230.0', '3.21956...e+17')

        self.assertNormalized('(18446744073709552000-4j)', '(1.84467...e+19-4j)')
        self.assertNormalized('(18446744073709552000+4j)', '(1.84467...e+19+4j)')

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
    def assertNormalized(self, actual, expected, py_cleaner=PYCleaner()):
        self.assertEqual(py_cleaner.cleanse(adjust(actual), None), adjust(expected))

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
        self.assertNormalized('7.95089e-06', '7.95089e-6')
        self.assertNormalized('7.950899e-06', '7.95089...e-6')
        self.assertNormalized('7.950899459780156e-06', '7.95089...e-6')

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
                var example = function(mod) {

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

class JSCleanerTests(TranspileTestCase):
    cleaner = JSCleaner()

    def test_cleanse_err_msg(self):
        js_in = adjust("""
        Traceback (most recent call last):
          File "<stdin>", line 1, in <module>
        NameError: name 'a' is not defined
        """)

        expected_out = adjust("""
        ### EXCEPTION ###
        NameError: name 'a' is not defined
            <stdin>:1
        """)

        self.assertEqual(expected_out, self.cleaner.cleanse(js_in, {}))

    def test_cleanse_memory_ref(self):
        js_in = adjust("""
        <turtle.Turtle object at 0x10299c588>
        """)

        expected_out = adjust("""
        <turtle.Turtle object at 0xXXXXXXXX>
        """)

        self.assertEqual(expected_out, self.cleaner.cleanse(js_in, {}))

    def test_cleanse_bool(self):
        js_in = adjust("""
        true
        false
        """)

        expected_out = adjust("""
        True
        False
        """)

        self.assertEqual(expected_out, self.cleaner.cleanse(js_in, {}))

    def test_cleanse_decimal(self):
        js_in = adjust("""
        3.000
        """)

        expected_out = adjust("""
        3.0
        """)

        self.assertEqual(expected_out, self.cleaner.cleanse(js_in, {}))

    def test_cleanse_float_exp(self):
        js_in = adjust("""
        55e-5
        55e-05
        55e-005
        """)

        expected_out = adjust("""
        55e-5
        55e-5
        55e-05
        """)
        self.assertEqual(expected_out, self.cleaner.cleanse(js_in, {}))

    def test_complex_num(self):
        js_in = adjust("""
        (1234567890123456-
        (1234567890123456+
        """)

        expected_out = adjust("""
        (1234567890123456.0.0-
        (1234567890123456.0.0+
        """)

        self.assertEqual(expected_out, self.cleaner.cleanse(js_in, {}))
