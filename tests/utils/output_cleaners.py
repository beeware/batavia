import os
import re
import sre_constants

JS_EXCEPTION = re.compile(
    'Traceback \(most recent call last\):\r?\n(  File "(?P<file>.*)", line (?P<line>\d+), in .*\r?\n)+(?P<exception>.*?): (?P<message>.*\r?\n)')  # NOQA
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
    injects a JSCleaner and PYCleaner object into the function
    use this as a decarator to configure which transformations should be performed
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
            out = JS_EXCEPTION.sub('### EXCEPTION ###{linesep}\\g<exception>: \\g<message>'.format(linesep=os.linesep),
                                   js_input)

            stack = JS_STACK.findall(js_input)

            stacklines = []
            test_dir = os.path.join(os.getcwd(), 'tests', 'temp')
            for filename, line in stack:
                if filename.startswith(test_dir):
                    filename = filename[len(test_dir) + 1:]
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
            try:
                out = JS_FLOAT_EXP.sub('\\1e\\2\\3', out)
            except:  # NOQA
                pass

        if self.transforms['high_precision_float']:
            # Replace high precision floats with abbreviated forms
            out = FLOAT_PRECISION.sub('\\1...', out)

        if self.transforms['test_ref']:
            # Replace references to the test script with something generic
            out = out.replace("'test.py'", '***EXECUTABLE***')

        if self.transforms['custom']:
            # Replace all the explicit data substitutions
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


class PYCleaner:
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
            out = PYTHON_EXCEPTION.sub(
                '### EXCEPTION ###{linesep}\\g<exception>: \\g<message>'.format(linesep=os.linesep),
                py_input
            )

            stack = PYTHON_STACK.findall(py_input)
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

        if self.transforms['memory_ref']:
            # Normalize memory references from output
            out = MEMORY_REFERENCE.sub("0xXXXXXXXX", out)

        if self.transforms['float_exp']:
            # Format floating point numbers using a lower case e

            try:
                out = PYTHON_FLOAT_EXP.sub('\\1e\\2\\3', out)
            except sre_constants.error:
                pass

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
