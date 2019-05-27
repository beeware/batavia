import base64
import collections
import http.client
import importlib
import itertools
import json
import os
import py_compile
import shutil
import subprocess
import sys

from unittest import TestCase

from .set_up_suite import setUpSuite
from .output_cleaners import JSCleaner, PYCleaner
from .adjust_code import adjust


def _normalize(value):
    """
    ||| -- lines starting with this pattern will be `eval`uated and compared as
        native python objects. Mostly used for output data from scripts.
    /// -- error messages might print out information from the object that
        generated it. This might lead to failure due to the ordering randomness
        of some object types. Lines starting with this pattern will be treated specially
        as to overcome this problem.

    Notice that a line might start with '||| ///'. This is helpful for string replacement cases.
    """
    native = value
    if value:
        if value.startswith('||| '):
            value = value[4:]
            try:
                native = eval(value)
            except:  # NOQA
                pass

        if value.startswith('/// '):
            value = value[4:]
            native = collections.Counter(value)

    return value, native


def _normalize_outputs(code1, code2, transform_output=None):
    """
    transform_output -- a function that receives one argument
        and returns a value to be used for comparing output values
    """
    if not transform_output:
        transform_output = lambda x: x  # NOQA

    processed_code1 = []
    processed_code2 = []

    lines1 = code1.split('\n')
    lines2 = code2.split('\n')

    for line1, line2 in itertools.zip_longest(lines1, lines2, fillvalue=None):

        line1, val1 = _normalize(line1)
        line2, val2 = _normalize(line2)
        if transform_output(val1) == transform_output(val2):
            line2 = line1
        elif (type(val1) == type(val2)
              and type(val1) in (float, complex)
              and val1 + val2 != 0
              and abs(val1 - val2) / abs(val1 + val2) < 0.0001):
            line2 = line1

        if line1 is not None:
            processed_code1.append(line1)
        if line2 is not None:
            processed_code2.append(line2)

    return '\n'.join(processed_code1), '\n'.join(processed_code2)


def runAsPython(test_dir, main_code, extra_code=None, run_in_function=False, wrap_in_try_catch=False, args=None):
    """Run a block of Python code with the Python interpreter."""
    # Output source code into test directory
    with open(os.path.join(test_dir, 'test.py'), 'w', encoding='utf-8') as py_source:
        py_source.write(adjust(main_code, run_in_function=run_in_function, wrap_in_try_catch=wrap_in_try_catch))

    if extra_code:
        for name, code in extra_code.items():
            path = name.split('.')
            path[-1] = path[-1] + '.py'
            if len(path) != 1:
                try:
                    os.makedirs(os.path.join(test_dir, *path[:-1]))
                except FileExistsError:
                    pass
            with open(os.path.join(test_dir, *path), 'w', encoding="utf-8") as py_source:
                py_source.write(adjust(code))

    if args is None:
        args = []

    env_copy = os.environ.copy()
    env_copy['PYTHONIOENCODING'] = 'UTF-8'
    proc = subprocess.Popen(
        [sys.executable, "test.py"] + args,
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        cwd=test_dir,
        env=env_copy,
    )
    try:
        out = proc.communicate(timeout=4)
    except subprocess.TimeoutExpired:
        proc.kill()
        proc.communicate()
        return "********** PYTHON EXECUTION TIMED OUT **********"

    return out[0].decode('utf8')


class TranspileTestCase(TestCase):
    @classmethod
    def setUpClass(cls):
        suite_data = setUpSuite()
        cls.temp_dir = suite_data.output_dir
        cls.batavia_js_dir = suite_data.batavia_js_dir
        cls.js_harness_port = suite_data.js_harness_port

    def assertCodeExecution(self, code, message=None, extra_code=None, run_in_global=True, run_in_function=True,
                            transform_output=None, allow_exceptions=False, args=None, substitutions=None,
                            js_cleaner=JSCleaner(), py_cleaner=PYCleaner()):

        "Run code as native python, and under JavaScript and check the output is identical"
        js_substitutions = dict(substitutions or {})
        js_substitutions['Javascript'] = ['TEST_RUNNER_TARGET']
        py_substitutions = dict(substitutions or {})
        py_substitutions['Python'] = ['TEST_RUNNER_TARGET']
        self.maxDiff = None
        # ==================================================
        # Pass 1 - run the code in the global context
        # ==================================================
        if run_in_global:
            try:
                self.makeTempDir()

                # Run the code as Python and as JavaScript.
                py_out = runAsPython(
                    self.temp_dir,
                    code,
                    extra_code=extra_code,
                    run_in_function=False,
                    wrap_in_try_catch=not allow_exceptions,
                    args=args
                )
                js_out = self.runAsJavaScript(
                    code,
                    extra_code=extra_code,
                    run_in_function=False,
                    wrap_in_try_catch=not allow_exceptions,
                    args=args,
                    python_exists=True
                )
            except Exception as e:
                self.fail(e)
            finally:
                # Clean up the test directory where the class file was written.
                shutil.rmtree(self.temp_dir)
            # Cleanse the Python and JavaScript output, producing a simple
            # normalized format for exceptions, floats etc.
            js_out, py_out = _normalize_outputs(js_out, py_out, transform_output=transform_output)
            js_out = js_cleaner.cleanse(js_out, js_substitutions)
            py_out = py_cleaner.cleanse(py_out, py_substitutions)

            # Confirm that the output of the JavaScript code is the same as the Python code.
            if message:
                context = 'Global context: %s' % message
            else:
                context = 'Global context'

            self.assertEqual(js_out, py_out, context)

        # ==================================================
        # Pass 2 - run the code in a function's context
        # ==================================================
        if run_in_function:
            try:
                self.makeTempDir()
                # Run the code as Python and as Java.
                py_out = runAsPython(
                    self.temp_dir,
                    code,
                    extra_code=extra_code,
                    run_in_function=True,
                    wrap_in_try_catch=not allow_exceptions,
                    args=args
                )
                js_out = self.runAsJavaScript(
                    code,
                    extra_code=extra_code,
                    run_in_function=True,
                    wrap_in_try_catch=not allow_exceptions,
                    args=args,
                    python_exists=True
                )
            except Exception as e:
                self.fail(e)
            finally:
                # Clean up the test directory where the class file was written.
                shutil.rmtree(self.temp_dir)

            # Cleanse the Python and JavaScript output, producing a simple
            # normalized format for exceptions, floats etc.
            js_out, py_out = _normalize_outputs(js_out, py_out, transform_output=transform_output)
            js_out = js_cleaner.cleanse(js_out, js_substitutions)
            py_out = py_cleaner.cleanse(py_out, py_substitutions)

            # Confirm that the output of the JavaScript code is the same as the Python code.
            if message:
                context = 'Function context: %s' % message
            else:
                context = 'Function context'

            self.assertEqual(js_out, py_out, context)

    def assertJavaScriptExecution(self, code, out, extra_code=None, js=None, run_in_global=True, run_in_function=True,
                                  args=None, substitutions=None, same=True, js_cleaner=JSCleaner()):
        "Run code under JavaScript and check the output is as expected"
        self.maxDiff = None
        # ==================================================
        # Prep - compile any required JavaScript sources
        # ==================================================
        # Cleanse the Python output, producing a simple
        # normalized format for exceptions, floats etc.
        py_out = adjust(out)

        # ==================================================
        # Pass 1 - run the code in the global context
        # ==================================================
        if run_in_global:
            try:
                self.makeTempDir()

                # Run the code as Javascript.
                js_out = self.runAsJavaScript(
                    code,
                    extra_code=extra_code,
                    js=js,
                    run_in_function=False,
                    args=args
                )
            except Exception as e:
                self.fail(e)
            finally:
                # Clean up the test directory where the class file was written.
                shutil.rmtree(self.temp_dir)

            # Cleanse the JavaScript output, producing a simple
            # normalized format for exceptions, floats etc.
            js_out = js_cleaner.cleanse(js_out, substitutions)

            # Compare the output of the JavaScript code with the Python code.
            if same:
                self.assertEqual(js_out, py_out, 'Global context')
            else:
                self.assertNotEqual(js_out, py_out, 'Global context')

        # ==================================================
        # Pass 2 - run the code in a function's context
        # ==================================================
        if run_in_function:
            try:
                self.makeTempDir()

                # Run the code as JavaScript.
                js_out = self.runAsJavaScript(
                    code,
                    extra_code=extra_code,
                    js=js,
                    run_in_function=True,
                    args=args
                )
            except Exception as e:
                self.fail(e)
            finally:
                # Clean up the test directory where the class file was written.
                shutil.rmtree(self.temp_dir)

            # Cleanse the JavaScript output, producing a simple
            # normalized format for exceptions, floats etc.
            js_out = js_cleaner.cleanse(js_out, substitutions)

            # Compare the output of the JavaScript code with the Python code.
            if same:
                self.assertEqual(js_out, py_out, 'Function context')
            else:
                self.assertNotEqual(js_out, py_out, 'Function context')

    def makeTempDir(self):
        """Create a "temp" subdirectory in the class's generated temporary directory if it doesn't currently exist."""
        try:
            os.mkdir(self.temp_dir)
        except FileExistsError:
            pass

    def runAsJavaScript(self, main_code, extra_code=None, js=None, run_in_function=False, wrap_in_try_catch=False,
                        args=None, python_exists=False):
        # Output source code into test directory
        assert isinstance(main_code, (str, bytes)), (
            'I have no idea how to run tests for code of type {}'
            ''.format(type(main_code))
        )

        # print("MAIN CODE:")
        # print(main_code)

        if not python_exists:
            if isinstance(main_code, str):
                py_filename = os.path.join(self.temp_dir, 'test.py')
                with open(py_filename, 'w', encoding='utf-8') as py_source:
                    py_source.write(
                        adjust(main_code, run_in_function=run_in_function, wrap_in_try_catch=wrap_in_try_catch))

        modules = []

        # Temporarily move into the test directory.
        cwd = os.getcwd()
        os.chdir(self.temp_dir)

        if isinstance(main_code, str):
            py_compile.compile('test.py')
            with open(importlib.util.cache_from_source('test.py'), 'rb') as compiled:
                modules.append(('test', base64.encodebytes(compiled.read()), 'test.py'))
        elif isinstance(main_code, bytes):
            modules.append(('test', main_code, 'test.py'))

        self.add_extra_code(extra_code, modules, python_exists)

        if args is None:
            args = []

        # Convert the dictionary of modules into a payload
        payload = []
        for name, code, filename in modules:
            lines = code.decode('utf-8').split('\n')
            output = '"%s"' % '" +\n            "'.join(line for line in lines if line)
            if name.endswith('.__init__'):
                name = name.rsplit('.', 1)[0]
            payload.append(
                '    "%s": {\n' % name +
                '        "__python__": true,\n' +
                '        "bytecode": %s,\n' % output +
                '        "filename": "%s"\n' % filename +
                '    }'
            )

        if js:
            for name, code in js.items():
                payload.append(
                    '    "%s": {\n' % name +
                    '        "javascript": %s\n' % name +
                    '    }'
                )

        js_code = adjust("""
            var batavia = require("%s");
            %s
            var modules = {
            %s
            };


            var vm = new batavia.VirtualMachine({
                loader: function(name) {
                    var payload = modules[name];
                    if (payload === undefined) {
                        return null;
                    }
                    return payload;
                },
                frame: null
            });
            vm.run('test', []);
            """) % (os.path.join(self.batavia_js_dir, 'batavia.js').replace('\\', '\\\\'),
                    '\n'.join(adjust(code) for name, code in
                              sorted(js.items())) if js else '',
                    ',\n'.join(payload))

        # print("JS CODE:")
        # print(js_code)

        server = http.client.HTTPConnection('localhost:' + self.js_harness_port)
        server.request(
            'POST',
            '/',
            body=json.dumps({'code': js_code}),
            headers={'Content-type': 'application/json'},
        )
        out = server.getresponse().read()
        server.close()

        # Move back to the old current working directory.
        os.chdir(cwd)

        return out.decode('utf8')

    def add_extra_code(self, extra_code, modules, python_exists):
        if extra_code:
            for name, code in extra_code.items():
                path = name.split('.')
                path[-1] = path[-1] + '.py'
                py_filename = os.path.join(*path)
                if not python_exists:
                    if len(path) != 1:
                        try:
                            os.makedirs(os.path.join(self.temp_dir, *path[:-1]))
                        except FileExistsError:
                            pass

                    with open(py_filename, 'w') as py_source:
                        py_source.write(adjust(code))

                py_compile.compile(py_filename)

                with open(importlib.util.cache_from_source(py_filename), 'rb') as compiled:
                    modules.append((name, base64.encodebytes(compiled.read()), py_filename))
