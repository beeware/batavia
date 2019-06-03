import unittest
import sys

from .utils import adjust, JSCleaner, PYCleaner, TranspileTestCase, remove_whitespace, wrap_in_exception_guard, \
    wrap_in_function


class TimeoutTests(TranspileTestCase):
    def test_infinite_loop(self):
        self.assertCodeExecution("""
            while True:
              pass
        """, substitutions={'RUNNER': ['PYTHON', 'JAVASCRIPT']})


class AdjustTests(unittest.TestCase):
    def test_remove_whitespace(self):
        """Test input is stripped and split into lines."""
        self.assertEqual(
            remove_whitespace(
                """
                while True:
                    print('----')
                """, indent=False),
            [
                "while True:",
                "    print('----')",
                ""
            ])

    def test_remove_whitespace_and_indent(self):
        """Test input is stripped and split into lines and indented."""
        self.assertEqual(
            remove_whitespace(
                """
                while True:
                    print('----')
                """, indent=True),
            [
                "    while True:",
                "        print('----')",
                ""
            ])

    def test_wrap_in_exception_guard(self):
        self.assertEqual(
            wrap_in_exception_guard(
                """
                print("banana")
                """
            ),
            """\
try:
    print("banana")

except Exception as e:
    print("Exception escaped test code in TEST_RUNNER_TARGET")
    print(repr(e))""")

    def test_wrap_in_function(self):
        self.assertEqual(
            wrap_in_function(
                """
                print("banana")
                """
            ),
            """\
def test_function():
    print("banana")

test_function()""")

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
        self.assertNormalized(
            'true', 'True', js_cleaner=JSCleaner(js_bool=True)
        )
        self.assertNormalized(
            'true', 'True', js_cleaner=JSCleaner(js_bool=True)
        )

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

    @unittest.skipUnless(sys.version_info < (3, 6), reason="Need CPython 3.5")
    def test_float_35(self):
        self.assertNormalized('7.95089e-06', '7.95089e-6')
        self.assertNormalized('7.950899e-06', '7.95089...e-6')
        self.assertNormalized('7.950899459780156e-06', '7.95089...e-6')

    @unittest.skipUnless(sys.version_info >= (3, 6), reason="Need CPython 3.6+")
    def test_float(self):
        self.assertNormalized('7.95089e-06', '7.95089e-06')
        self.assertNormalized('7.950899e-06', '7.95089...e-06')
        self.assertNormalized('7.950899459780156e-06', '7.95089...e-06')

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
    cleaner = JSCleaner(js_bool=True)

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

    @unittest.skipUnless(sys.version_info == (3, 5), reason="Need CPython 3.5")
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

    def test_high_precision_float(self):
        js_in = adjust("""
        4.00000000000000000001
        """)

        expected_out = adjust("""
        4.0
        """)

        self.assertEqual(expected_out, self.cleaner.cleanse(js_in, {}))

    def test_memory_ref(self):
        js_in = adjust("""
        'test.py'
        """)

        expected_out = adjust("""
        ***EXECUTABLE***
        """)

        self.assertEqual(expected_out, self.cleaner.cleanse(js_in, {}))

    def test_custom(self):
        js_in = adjust("""
        'we are the knights'
        """)

        expected_out = adjust("""
        'we are the knights who go NI'
        """)

        custom_replacement = {
            'we are the knights who go NI': ['we are the knights']
        }

        self.assertEqual(expected_out, self.cleaner.cleanse(js_in, custom_replacement))

class PYCleanerTests(TranspileTestCase):
    cleaner = PYCleaner()

    def test_cleanse_err_msg(self):
        py_in = adjust("""
        Traceback (most recent call last):
          File "<stdin>", line 1, in <module>
        NameError: name 'a' is not defined
        """)

        expected_out = adjust("""
        Traceback (most recent call last):
          File "<stdin>", line 1, in <module>
        NameError: name 'a' is not defined
        """)

        self.assertEqual(expected_out, self.cleaner.cleanse(py_in, {}))

    def test_cleanse_memory_ref(self):
        py_in = adjust("""
        <turtle.Turtle object at 0x10299c588>
        """)

        expected_out = adjust("""
        <turtle.Turtle object at 0xXXXXXXXX>
        """)

        self.assertEqual(expected_out, self.cleaner.cleanse(py_in, {}))

    @unittest.skipUnless(sys.version_info == (3, 5), reason="Need CPython 3.5")
    def test_cleanse_float_exp(self):
        py_in = adjust("""
        55e-5
        55e-05
        55e-005
        """)

        expected_out = adjust("""
        55e-5
        55e-5
        55e-05
        """)
        self.assertEqual(expected_out, self.cleaner.cleanse(py_in, {}))

    def test_complex_num(self):
        py_in = adjust("""
        (1234567890123456-
        (1234567890123456+
        """)

        expected_out = adjust("""
        (1234567890123456-
        (1234567890123456+
        """)

        self.assertEqual(expected_out, self.cleaner.cleanse(py_in, {}))

    def test_high_precision_float(self):
        py_in = adjust("""
        4.00000000000000000001
        """)

        expected_out = adjust("""
        4.00000...
        """)

        self.assertEqual(expected_out, self.cleaner.cleanse(py_in, {}))

    def test_ref(self):
        py_in = adjust("""
        'test.py'
        """)

        expected_out = adjust("""
        ***EXECUTABLE***
        """)

        self.assertEqual(expected_out, self.cleaner.cleanse(py_in, {}))

    def test_custom(self):
        js_in = adjust("""
        'we are the knights who say NI'
        """)

        expected_out = adjust("""
        'We are now the Knights Who Say Ecky-ecky-ecky-ecky-pikang-zoop-boing-goodem-zoo-owli-zhiv'
        """)

        custom_replacement = {
            'We are now the Knights Who Say Ecky-ecky-ecky-ecky-pikang-zoop-boing-goodem-zoo-owli-zhiv': ['we are the knights who say NI']
        }

        self.assertEqual(expected_out, self.cleaner.cleanse(js_in, custom_replacement))
