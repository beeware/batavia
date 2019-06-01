import os
import re
import sre_constants

JS_EXCEPTION = re.compile(
    'Traceback \\(most recent call last\\):\r?\n(  File "(?P<file>.*)", line (?P<line>\d+), in .*\r?\n)+(?P<exception>.*?): (?P<message>.*\r?\n)')  # NOQA
JS_STACK = re.compile('  File "(?P<file>.*)", line (?P<line>\\d+), in .*\r?\n')
JS_BOOL_TRUE = re.compile('true')
JS_BOOL_FALSE = re.compile('false')
JS_FLOAT_DECIMAL = re.compile(r'''(?<!['\"])(\d+\.\d+)''')
JS_FLOAT_EXP = re.compile('(\\d+)e(-)?0?(\\d+)')
JS_LARGE_COMPLEX = re.compile('\\((\\d{15}\\d+)[-+]')

PYTHON_EXCEPTION = re.compile(
    'Traceback \\(most recent call last\\):\r?\n(  File "(?P<file>.*)", line (?P<line>\\d+), in .*\r?\n    .*\r?\n)+(?P<exception>.*?): (?P<message>.*\r?\n)')  # NOQA
PYTHON_STACK = re.compile('  File "(?P<file>.*)", line (?P<line>\\d+), in .*\r?\n    .*\r?\n')
PYTHON_FLOAT_EXP = re.compile('(\\d+)e(-)?0?(\\d+)')
PYTHON_NEGATIVE_ZERO_J = re.compile('-0j\\)')

# Prevent floating point discrepancies in very low significant digits from being an issue
FLOAT_PRECISION = re.compile('(\\.\\d{5})\\d+')
MEMORY_REFERENCE = re.compile('0x[\\dABCDEFabcdef]{4,16}')


def transforms(**transform_args):
    """
    Decorator which injects js_cleaner and py_cleaner objects into the function. Configures which
    string transformations will be applied.

    A common use for @transforms is to avoid false negative test results caused by the cleaner
    formatting being applied incorrectly, for example when using string.format() or types.Float,
    which should immitate Python formatting with no cleaning needed.

    JS Native Type Reformatting

        decimal: Replace floating point numbers in decimal form with the form used by python.
        float_exp: Format floating point numbers using a lower case e, eg. -5.00000...e-01.
        high_precision_float: Replace high precision floats with abbreviated forms.
        js_bool: Normalize true and false to True and False.

    General

        err_msg: Test the specific error message.
        memory_ref: Normalize memory references (0xA1234CC) from output.

    Test-Specific

        test_ref: Replace references to the test script with something generic.
        custom: Enable/disable custom substitutions, which can be added later.
    """

    def _dec(function):
        def wrapper(self, *args, **kwargs):
            # js_cleaner
            js_excludes = ['py_test_script', 'py_str_excep']
            js_params = {
                jsk: jsv
                for jsk, jsv
                in transform_args.items()
                if jsk not in js_excludes
            }
            js_cleaner = JSCleaner(**js_params)

            # py_cleaner
            py_excludes = ['js_bool', 'decimal', 'float_exp']
            py_params = {
                pyk: pyv
                for pyk, pyv
                in transform_args.items()
                if pyk not in py_excludes
            }
            py_cleaner = PYCleaner(**py_params)

            res = function(self, js_cleaner, py_cleaner, *args, **kwargs)
            return res

        wrapper.__name__ = function.__name__
        wrapper.__doc__ = function.__doc__
        return wrapper

    return _dec


class JSCleaner:
    """Pairs with PYCleaner to normalize JavaScript native output to match Python native output.
    Use @transform for configurations."""
    def __init__(self, err_msg=True, memory_ref=True, js_bool=False, decimal=True, float_exp=True, complex_num=True,
                 high_precision_float=True, test_ref=True, custom=True):

        self.transforms = {
            'err_msg': err_msg,
            'memory_ref': memory_ref,
            'js_bool': js_bool,
            'decimal': decimal,
            'float_exp': float_exp,
            'complex_num': complex_num,
            'high_precision_float': high_precision_float,
            'test_ref': test_ref,
            'custom': custom
        }

    def cleanse(self, js_input, substitutions):
        """
        cleanse output from javascript
        """
        # Test the specific message
        out = js_input
        if self.transforms['err_msg']:
            out = transform_stack(out, JS_EXCEPTION, JS_STACK, self.stack_to_lines)

        # Normalize memory references from output
        if self.transforms['memory_ref']:
            out = MEMORY_REFERENCE.sub("0xXXXXXXXX", out)

        if self.transforms['js_bool']:
            # Normalize true and false to True and False
            out = JS_BOOL_TRUE.sub("True", out)
            out = JS_BOOL_FALSE.sub("False", out)

        if self.transforms['decimal']:
            # Replace floating point numbers in decimal form with
            # the form used by python
            for match in JS_FLOAT_DECIMAL.findall(out):
                out = out.replace(match, str(float(match)))

        if self.transforms['float_exp']:
            # Format floating point numbers using a lower case e
            out = transform_float_exponent(out, JS_FLOAT_EXP)

        if self.transforms['high_precision_float']:
            # Replace high precision floats with abbreviated forms
            out = FLOAT_PRECISION.sub('\\1...', out)

        if self.transforms['test_ref']:
            # Replace references to the test script with something generic
            out = out.replace("'test.py'", '***EXECUTABLE***')

        if self.transforms['custom']:
            # Replace all the explicit data substitutions
            out = make_custom_substitutions(out, substitutions)

        return out

    def stack_to_lines(self, stack):
        test_dir = os.path.join(os.getcwd(), 'tests', 'temp')
        for filename, line in stack:
            if filename.startswith(test_dir):
                filename = filename[len(test_dir) + 1:]
            yield "    %s:%s" % (filename, line)


class PYCleaner:
    """Pairs with JSCleaner to normalize JavaScript native output to match Python native output.
    Use @transform for configurations."""
    def __init__(self, err_msg=True, memory_ref=True, float_exp=True, complex_num=True,
                 high_precision_float=True, test_ref=True, custom=True):

        self.transforms = {
            'err_msg': err_msg,
            'memory_ref': memory_ref,
            'float_exp': float_exp,
            'complex_num': complex_num,
            'high_precision_float': high_precision_float,
            'test_ref': test_ref,
            'custom': custom
        }

    def cleanse(self, py_input, substitutions):
        """
        cleanse output from python
        """
        out = py_input
        if self.transforms['err_msg']:
            # Test the specific message
            out = transform_stack(out, PYTHON_EXCEPTION, PYTHON_STACK,
                                  lambda stack: ["    %s:%s" % (s[0], s[1]) for s in stack])

        if self.transforms['memory_ref']:
            # Normalize memory references from output
            out = MEMORY_REFERENCE.sub("0xXXXXXXXX", out)

        if self.transforms['float_exp']:
            # Format floating point numbers using a lower case e
            out = transform_float_exponent(out, PYTHON_FLOAT_EXP)

        if self.transforms['high_precision_float']:
            # Replace high precision floats with abbreviated forms
            out = FLOAT_PRECISION.sub('\\1...', out)

        if self.transforms['test_ref']:
            # Replace references to the test script with something generic
            out = out.replace("'test.py'", '***EXECUTABLE***')

        # Python 3.4.4 changed the message describing strings in exceptions
        out = out.replace(
            'argument must be a string or',
            'argument must be a string, a bytes-like object or'
        )

        if self.transforms['custom']:
            out = make_custom_substitutions(out, substitutions)

        return out


def transform_stack(source, exc_type_regex, stack_regex, stack_to_lines):
    out = exc_type_regex.sub('### EXCEPTION ###{linesep}\\g<exception>: \\g<message>'.format(linesep=os.linesep),
                             source)
    stack = stack_regex.findall(source)
    stacklines = stack_to_lines(stack)
    out = '%s%s%s' % (out, os.linesep.join(stacklines), os.linesep if stack else '')
    return out


def transform_float_exponent(out, float_type_regex):
    try:
        out = float_type_regex.sub('\\1e\\2\\3', out)
    except sre_constants.error:
        pass
    return out


def make_custom_substitutions(out, substitutions):
    if substitutions:
        for to_value, from_values in substitutions.items():
            for from_value in from_values:
                # check for regex
                if hasattr(from_value, 'pattern'):
                    out = re.sub(from_value.pattern, re.escape(to_value), out, 0, re.MULTILINE)
                else:
                    out = out.replace(from_value, to_value)
    out = out.replace('\r\n', '\n')
    # trim trailing whitespace on non-blank lines
    out = '\n'.join(o.rstrip() for o in out.split('\n'))
    return out
