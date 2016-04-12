import base64
import contextlib
from io import StringIO, BytesIO
import importlib
import os
import py_compile
import re
import shutil
import subprocess
import sys
import traceback
from unittest import TestCase


# A state variable to determine if the test environment has been configured.
_suite_configured = False


def setUpSuite():
    """Configure the entire test suite.

    This only needs to be run once, prior to the first test.
    """
    global _suite_configured
    if _suite_configured:
        return

    proc = subprocess.Popen(
        "make",
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        shell=True,
    )

    try:
        out, err = proc.communicate(timeout=15)
    except subprocess.TimeoutExpired:
        proc.kill()
        out, err = proc.communicate()
        raise

    if proc.returncode != 0:
        raise Exception("Error compiling batavia sources: " + out.decode('ascii'))

    _suite_configured = True


@contextlib.contextmanager
def capture_output(redirect_stderr=True):
    oldout, olderr = sys.stdout, sys.stderr
    try:
        out = StringIO()
        sys.stdout = out
        if redirect_stderr:
            sys.stderr = out
        else:
            sys.stderr = StringIO()
        yield out
    except:
        if redirect_stderr:
            traceback.print_exc()
        else:
            raise
    finally:
        sys.stdout, sys.stderr = oldout, olderr


def adjust(text, run_in_function=False):
    """Adjust a code sample to remove leading whitespace."""
    lines = text.split('\n')
    if len(lines) == 1:
        return text

    if lines[0].strip() == '':
        lines = lines[1:]
    first_line = lines[0].lstrip()
    n_spaces = len(lines[0]) - len(first_line)

    if run_in_function:
        n_spaces = n_spaces - 4

    final_lines = [line[n_spaces:] for line in lines]

    if run_in_function:
        final_lines = [
            "def test_function():",
        ] + final_lines + [
            "test_function()",
        ]

    return '\n'.join(final_lines)


def runAsPython(test_dir, main_code, extra_code=None, run_in_function=False, args=None):
    """Run a block of Python code with the Python interpreter."""
    # Output source code into test directory
    with open(os.path.join(test_dir, 'test.py'), 'w') as py_source:
        py_source.write(adjust(main_code, run_in_function=run_in_function))

    if extra_code:
        for name, code in extra_code.items():
            path = name.split('.')
            path[-1] = path[-1] + '.py'
            if len(path) != 1:
                try:
                    os.makedirs(os.path.join(test_dir, *path[:-1]))
                except FileExistsError:
                    pass
            with open(os.path.join(test_dir, *path), 'w') as py_source:
                py_source.write(adjust(code))

    if args is None:
        args = []

    proc = subprocess.Popen(
        [sys.executable, "test.py"] + args,
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        cwd=test_dir,
    )
    out = proc.communicate()

    return out[0].decode('utf8')


def runAsJavaScript(test_dir, main_code, extra_code=None, run_in_function=False, args=None):
    # Output source code into test directory
    py_filename = os.path.join(test_dir, 'test.py')
    with open(py_filename, 'w') as py_source:
        py_source.write(adjust(main_code, run_in_function=run_in_function))

    modules = {}

    # Temporarily move into the test directory.
    cwd = os.getcwd()
    os.chdir(test_dir)

    py_compile.compile('test.py')
    with open(importlib.util.cache_from_source('test.py'), 'rb') as compiled:
        modules['testcase'] = base64.encodebytes(compiled.read())

    if extra_code:
        for name, code in extra_code.items():
            path = name.split('.')
            path[-1] = path[-1] + '.py'
            if len(path) != 1:
                try:
                    os.makedirs(os.path.join(test_dir, *path[:-1]))
                except FileExistsError:
                    pass

            py_filename = os.path.join(*path)
            with open(py_filename, 'w') as py_source:
                py_source.write(adjust(code))

            py_compile.compile(py_filename)
            with open(importlib.util.cache_from_source(py_filename), 'rb') as compiled:
                modules[name] = base64.encodebytes(compiled.read())

    # Move back to the old current working directory.
    os.chdir(cwd)

    if args is None:
        args = []

    with open(os.path.join(test_dir, 'test.js'), 'w') as js_file:
        with open(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'batavia.js')) as batavia_js:
            # js_file.write(batavia_js.read())

            payload = []
            for name, code in modules.items():
                lines = code.decode('utf-8').split('\n')
                output = '"%s"' % '" +\n        "'.join(line for line in lines if line)
                payload.append('"%s": %s' % (name, output))

            js_file.write(adjust("""
                var page;

                page = require('webpage').create();

                page.onConsoleMessage = function (msg) {
                    console.log(msg);
                };

                page.evaluate(function () {
                    %s

                    // Function.bind polyfill
                    if (!Function.prototype.bind) {
                      Function.prototype.bind = function (oThis) {
                        if (typeof this !== "function") {
                          // closest thing possible to the ECMAScript 5 internal IsCallable function
                          throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
                        }

                        var aArgs = Array.prototype.slice.call(arguments, 1),
                            fToBind = this,
                            fNOP = function () {},
                            fBound = function () {
                              return fToBind.apply(this instanceof fNOP && oThis
                                                     ? this
                                                     : oThis,
                                                   aArgs.concat(Array.prototype.slice.call(arguments)));
                            };

                        fNOP.prototype = this.prototype;
                        fBound.prototype = new fNOP();

                        return fBound;
                      };
                    }

                    var modules = {
                    %s
                    };

                    // console.log('Create VM...');
                    var vm = new batavia.VirtualMachine(function(name) {
                        return modules['testcase'];
                    });
                    // console.log('Run module...');
                    vm.run('testcase', []);
                    // console.log('Done.');
                });

                phantom.exit(0);

                """) % (
                    batavia_js.read(),
                    ',\n'.join(payload)
                )
            )

    proc = subprocess.Popen(
        ["phantomjs", "test.js"] + args,
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        cwd=test_dir,
    )
    out = proc.communicate()

    return out[0].decode('utf8').replace('\n\n', '\n')


def compileJava(js_dir, js):
    if not js:
        return None

    sources = []
    with capture_output():
        for descriptor, code in js.items():
            parts = descriptor.split('/')

            class_dir = os.path.sep.join(parts[:-1])
            class_file = os.path.join(class_dir, "%s.js" % parts[-1])

            full_dir = os.path.join(js_dir, class_dir)
            full_path = os.path.join(js_dir, class_file)

            try:
                os.makedirs(full_dir)
            except FileExistsError:
                pass

            with open(full_path, 'w') as js_source:
                js_source.write(adjust(code))

            sources.append(class_file)

    classpath = os.pathsep.join([
        os.path.join('..', '..', 'dist', 'python-js.jar'),
        os.curdir,
    ])
    proc = subprocess.Popen(
        ["jsc", "-classpath", classpath] + sources,
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        cwd=js_dir,
    )
    out = proc.communicate()

    return out[0].decode('utf8')


JS_EXCEPTION = re.compile('Traceback \(most recent call last\):\r?\n(  File "(?P<file>.*)", line (?P<line>\d+), in .*\r?\n)+(?P<exception>.*?): (?P<message>.*\r?\n)')
JS_STACK = re.compile('  File "(?P<file>.*)", line (?P<line>\d+), in .*\r?\n')
JS_FLOAT = re.compile('(\d+)e(-)?0?(\d+)')

PYTHON_EXCEPTION = re.compile('Traceback \(most recent call last\):\r?\n(  File "(?P<file>.*)", line (?P<line>\d+), in .*\r?\n    .*\r?\n)+(?P<exception>.*?): (?P<message>.*\r?\n)')
PYTHON_STACK = re.compile('  File "(?P<file>.*)", line (?P<line>\d+), in .*\r?\n    .*\r?\n')
PYTHON_FLOAT = re.compile('(\d+)e(-)?0?(\d+)')

MEMORY_REFERENCE = re.compile('0x[\dabcdef]{4,8}')


def cleanse_javascript(input):
    out = JS_EXCEPTION.sub('### EXCEPTION ###{linesep}\\g<exception>: \\g<message>'.format(linesep=os.linesep), input)
    stack = JS_STACK.findall(input)

    stacklines = []
    test_dir = os.path.join(os.getcwd(), 'tests', 'temp')
    for filename, line in stack:
        if filename.startswith(test_dir):
            filename = filename[len(test_dir)+1:]
        stacklines.append(
            "    %s:%s" % (
                filename, line
            )
        )

    out = '%s%s%s' % (
        out,
        os.linesep.join(stacklines),
        os.linesep if stack else ''
    )
    out = MEMORY_REFERENCE.sub("0xXXXXXXXX", out)
    out = JS_FLOAT.sub('\\1e\\2\\3', out).replace("'test.py'", '***EXECUTABLE***')
    out = out.replace('\r\n', '\n')
    return out


def cleanse_python(input):
    out = PYTHON_EXCEPTION.sub('### EXCEPTION ###{linesep}\\g<exception>: \\g<message>'.format(linesep=os.linesep), input)
    stack = PYTHON_STACK.findall(input)
    out = '%s%s%s' % (
        out,
        os.linesep.join(
            [
                "    %s:%s" % (s[0], s[1])
                for s in stack
            ]
        ),
        os.linesep if stack else ''
    )
    out = MEMORY_REFERENCE.sub("0xXXXXXXXX", out)
    out = PYTHON_FLOAT.sub('\\1e\\2\\3', out).replace("'test.py'", '***EXECUTABLE***')
    out = out.replace('\r\n', '\n')
    return out


class TranspileTestCase(TestCase):
    def setUp(self):
        setUpSuite()

    def assertBlock(self, python, js):
        self.maxDiff = None
        dump = False

        py_block = PyBlock(parent=PyModule('test', 'test.py'))
        if python:
            python = adjust(python)
            code = compile(python, '<test>', 'exec')
            py_block.extract(code, debug=dump)

        js_code = py_block.transpile()

        out = BytesIO()
        constant_pool = ConstantPool()
        js_code.resolve(constant_pool)

        constant_pool.add(Utf8('test'))
        constant_pool.add(Utf8('Code'))
        constant_pool.add(Utf8('LineNumberTable'))

        writer = ClassFileWriter(out, constant_pool)
        js_code.write(writer)

        debug = StringIO()
        reader = ClassFileReader(BytesIO(out.getbuffer()), constant_pool, debug=debug)
        JavaCode.read(reader, dump=0)

        if dump:
            print(debug.getvalue())

        js = adjust(js)
        self.assertEqual(debug.getvalue(), js[1:])

    def assertCodeExecution(self, code, message=None, extra_code=None, run_in_global=True, run_in_function=True, args=None):
        "Run code as native python, and under Java and check the output is identical"
        self.maxDiff = None
        #==================================================
        # Pass 1 - run the code in the global context
        #==================================================
        if run_in_global:
            try:
                # Create the temp directory into which code will be placed
                test_dir = os.path.join(os.path.dirname(__file__), 'temp')
                try:
                    os.mkdir(test_dir)
                except FileExistsError:
                    pass

                # Run the code as Python and as Java.
                py_out = runAsPython(test_dir, code, extra_code, False, args=args)
                js_out = runAsJavaScript(test_dir, code, extra_code, False, args=args)
            except Exception as e:
                self.fail(e)
            finally:
                # Clean up the test directory where the class file was written.
                shutil.rmtree(test_dir)
                # print(js_out)

            # Cleanse the Python and Java output, producing a simple
            # normalized format for exceptions, floats etc.
            js_out = cleanse_javascript(js_out)
            py_out = cleanse_python(py_out)

            # Confirm that the output of the Java code is the same as the Python code.
            if message:
                context = 'Global context: %s' % message
            else:
                context = 'Global context'
            self.assertEqual(js_out, py_out, context)

        #==================================================
        # Pass 2 - run the code in a function's context
        #==================================================
        if run_in_function:
            try:
                # Create the temp directory into which code will be placed
                test_dir = os.path.join(os.path.dirname(__file__), 'temp')
                try:
                    os.mkdir(test_dir)
                except FileExistsError:
                    pass

                # Run the code as Python and as Java.
                py_out = runAsPython(test_dir, code, extra_code, True, args=args)
                js_out = runAsJavaScript(test_dir, code, extra_code, True, args=args)
            except Exception as e:
                self.fail(e)
            finally:
                # Clean up the test directory where the class file was written.
                shutil.rmtree(test_dir)
                # print(js_out)

            # Cleanse the Python and Java output, producing a simple
            # normalized format for exceptions, floats etc.
            js_out = cleanse_javascript(js_out)
            py_out = cleanse_python(py_out)

            # Confirm that the output of the Java code is the same as the Python code.
            if message:
                context = 'Function context: %s' % message
            else:
                context = 'Function context'
            self.assertEqual(js_out, py_out, context)

    def assertJavaScriptExecution(self, code, out, extra_code=None, js=None, run_in_global=True, run_in_function=True, args=None):
        "Run code under Java and check the output is as expected"
        self.maxDiff = None
        try:
            #==================================================
            # Prep - compile any required Java sources
            #==================================================
            # Create the temp directory into which code will be placed
            js_dir = os.path.join(os.path.dirname(__file__), 'js')

            try:
                os.mkdir(js_dir)
            except FileExistsError:
                pass

            # Cleanse the Python output, producing a simple
            # normalized format for exceptions, floats etc.
            py_out = adjust(out)

            #==================================================
            # Pass 1 - run the code in the global context
            #==================================================
            if run_in_global:
                try:
                    # Create the temp directory into which code will be placed
                    test_dir = os.path.join(os.path.dirname(__file__), 'temp')
                    try:
                        os.mkdir(test_dir)
                    except FileExistsError:
                        pass

                    # Run the code as Java.
                    js_out = runAsJavaScript(test_dir, code, extra_code, False, args=args)
                except Exception as e:
                    self.fail(e)
                finally:
                    # Clean up the test directory where the class file was written.
                    shutil.rmtree(test_dir)
                    # print(js_out)

                # Cleanse the Java output, producing a simple
                # normalized format for exceptions, floats etc.
                js_out = cleanse_javascript(js_out)

                # Confirm that the output of the Java code is the same as the Python code.
                self.assertEqual(js_out, py_out, 'Global context')

            #==================================================
            # Pass 2 - run the code in a function's context
            #==================================================
            if run_in_function:
                try:
                    # Create the temp directory into which code will be placed
                    test_dir = os.path.join(os.path.dirname(__file__), 'temp')
                    try:
                        os.mkdir(test_dir)
                    except FileExistsError:
                        pass

                    # Run the code as JavaScript.
                    js_out = runAsJavaScript(test_dir, code, extra_code, True, args=args)
                except Exception as e:
                    self.fail(e)
                finally:
                    # Clean up the test directory where the class file was written.
                    shutil.rmtree(test_dir)
                    # print(js_out)

                # Cleanse the Java output, producing a simple
                # normalized format for exceptions, floats etc.
                js_out = cleanse_javascript(js_out)

                # Confirm that the output of the JavaScript code is the same as the Python code.
                self.assertEqual(js_out, py_out, 'Function context')

        finally:
            # Clean up the js directory where the class file was written.
            shutil.rmtree(js_dir)


def _unary_test(test_name, operation):
    def func(self):
        for value in self.values:
            self.assertUnaryOperation(x=value, operation=operation, format=self.format)
    return func


class UnaryOperationTestCase:
    format = ''

    def run(self, result=None):
        # Override the run method to inject the "expectingFailure" marker
        # when the test case runs.
        for test_name in dir(self):
            if test_name.startswith('test_'):
                getattr(self, test_name).__dict__['__unittest_expecting_failure__'] = test_name in self.not_implemented
        return super().run(result=result)

    def assertUnaryOperation(self, **kwargs):
        self.assertCodeExecution("""
            x = %(x)s
            print(%(format)s%(operation)sx)
            """ % kwargs)

    test_unary_positive = _unary_test('test_unary_positive', '+')
    test_unary_negative = _unary_test('test_unary_negative', '-')
    test_unary_not = _unary_test('test_unary_not', 'not ')
    test_unary_invert = _unary_test('test_unary_invert', '~')


SAMPLE_DATA = [
    ('bool', ['True', 'False']),
    # ('bytearray', [3]),
    ('bytes', ["b''", "b'This is another string of bytes'"]),
    # ('class', ['']),
    # ('complex', ['']),
    ('dict', ["{}", "{'a': 1, 'c': 2.3456, 'd': 'another'}"]),
    ('float', ['2.3456', '0.0', '-3.14159']),
    # ('frozenset', ),
    ('int', ['3', '0', '-5']),
    ('list', ["[]", "[3, 4, 5]"]),
    ('set', ["set()", "{1, 2.3456, 'another'}"]),
    ('str', ['""', '"This is another string"']),
    ('tuple', ["(1, 2.3456, 'another')"]),
]


def _binary_test(test_name, operation, examples):
    def func(self):
        for value in self.values:
            for example in examples:
                self.assertBinaryOperation(x=value, y=example, operation=operation, format=self.format)
    return func


class BinaryOperationTestCase:
    format = ''
    y = 3

    def run(self, result=None):
        # Override the run method to inject the "expectingFailure" marker
        # when the test case runs.
        for test_name in dir(self):
            if test_name.startswith('test_'):
                getattr(self, test_name).__dict__['__unittest_expecting_failure__'] = test_name in self.not_implemented
        return super().run(result=result)

    def assertBinaryOperation(self, **kwargs):
        self.assertCodeExecution("""
            x = %(x)s
            y = %(y)s
            print(%(format)s%(operation)s)
            """ % kwargs, "Error running %(operation)s with x=%(x)s and y=%(y)s" % kwargs)

    for datatype, examples in SAMPLE_DATA:
        vars()['test_add_%s' % datatype] = _binary_test('test_add_%s' % datatype, 'x + y', examples)
        vars()['test_subtract_%s' % datatype] = _binary_test('test_subtract_%s' % datatype, 'x - y', examples)
        vars()['test_multiply_%s' % datatype] = _binary_test('test_multiply_%s' % datatype, 'x * y', examples)
        vars()['test_floor_divide_%s' % datatype] = _binary_test('test_floor_divide_%s' % datatype, 'x // y', examples)
        vars()['test_true_divide_%s' % datatype] = _binary_test('test_true_divide_%s' % datatype, 'x / y', examples)
        vars()['test_modulo_%s' % datatype] = _binary_test('test_modulo_%s' % datatype, 'x % y', examples)
        vars()['test_power_%s' % datatype] = _binary_test('test_power_%s' % datatype, 'x ** y', examples)
        vars()['test_subscr_%s' % datatype] = _binary_test('test_subscr_%s' % datatype, 'x[y]', examples)
        vars()['test_lshift_%s' % datatype] = _binary_test('test_lshift_%s' % datatype, 'x << y', examples)
        vars()['test_rshift_%s' % datatype] = _binary_test('test_rshift_%s' % datatype, 'x >> y', examples)
        vars()['test_and_%s' % datatype] = _binary_test('test_and_%s' % datatype, 'x & y', examples)
        vars()['test_xor_%s' % datatype] = _binary_test('test_xor_%s' % datatype, 'x ^ y', examples)
        vars()['test_or_%s' % datatype] = _binary_test('test_or_%s' % datatype, 'x | y', examples)

        vars()['test_lt_%s' % datatype] = _binary_test('test_lt_%s' % datatype, 'x < y', examples)
        vars()['test_le_%s' % datatype] = _binary_test('test_le_%s' % datatype, 'x <= y', examples)
        vars()['test_gt_%s' % datatype] = _binary_test('test_gt_%s' % datatype, 'x > y', examples)
        vars()['test_ge_%s' % datatype] = _binary_test('test_ge_%s' % datatype, 'x >= y', examples)
        vars()['test_eq_%s' % datatype] = _binary_test('test_eq_%s' % datatype, 'x == y', examples)
        vars()['test_ne_%s' % datatype] = _binary_test('test_ne_%s' % datatype, 'x != y', examples)


def _inplace_test(test_name, operation, examples):
    def func(self):
        for value in self.values:
            for example in examples:
                self.assertInplaceOperation(x=value, y=example, operation=operation, format=self.format)
    return func


class InplaceOperationTestCase:
    format = ''
    y = 3

    def run(self, result=None):
        # Override the run method to inject the "expectingFailure" marker
        # when the test case runs.
        for test_name in dir(self):
            if test_name.startswith('test_'):
                getattr(self, test_name).__dict__['__unittest_expecting_failure__'] = test_name in self.not_implemented
        return super().run(result=result)

    def assertInplaceOperation(self, **kwargs):
        self.assertCodeExecution("""
            x = %(x)s
            y = %(y)s
            %(operation)s
            print(%(format)sx)
            """ % kwargs, "Error running %(operation)s with x=%(x)s and y=%(y)s" % kwargs)

    for datatype, examples in SAMPLE_DATA:
        vars()['test_add_%s' % datatype] = _inplace_test('test_add_%s' % datatype, 'x += y', examples)
        vars()['test_subtract_%s' % datatype] = _inplace_test('test_subtract_%s' % datatype, 'x -= y', examples)
        vars()['test_multiply_%s' % datatype] = _inplace_test('test_multiply_%s' % datatype, 'x *= y', examples)
        vars()['test_floor_divide_%s' % datatype] = _inplace_test('test_floor_divide_%s' % datatype, 'x //= y', examples)
        vars()['test_true_divide_%s' % datatype] = _inplace_test('test_true_divide_%s' % datatype, 'x /= y', examples)
        vars()['test_modulo_%s' % datatype] = _inplace_test('test_modulo_%s' % datatype, 'x %= y', examples)
        vars()['test_power_%s' % datatype] = _inplace_test('test_power_%s' % datatype, 'x **= y', examples)
        vars()['test_lshift_%s' % datatype] = _inplace_test('test_lshift_%s' % datatype, 'x <<= y', examples)
        vars()['test_rshift_%s' % datatype] = _inplace_test('test_rshift_%s' % datatype, 'x >>= y', examples)
        vars()['test_and_%s' % datatype] = _inplace_test('test_and_%s' % datatype, 'x &= y', examples)
        vars()['test_xor_%s' % datatype] = _inplace_test('test_xor_%s' % datatype, 'x ^= y', examples)
        vars()['test_or_%s' % datatype] = _inplace_test('test_or_%s' % datatype, 'x |= y', examples)
