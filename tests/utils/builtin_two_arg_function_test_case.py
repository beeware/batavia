from .adjust import adjust
from .expected_failure import NotImplementedToExpectedFailure
from .samples import SAMPLE_SUBSTITUTIONS, SAMPLE_DATA


def _builtin_twoarg_test(test_name, operation, examples1, examples2):
    def func(self):
        self.assertBuiltinTwoargFunction(
            self.function,
            x_values=examples1,
            y_values=examples2,
            operation=operation,
            format=self.format,
            substitutions=getattr(self, 'substitutions', SAMPLE_SUBSTITUTIONS)
        )
    return func


class BuiltinTwoargFunctionTestCase(NotImplementedToExpectedFailure):
    format = ''

    def assertBuiltinTwoargFunction(self, function, x_values, y_values, operation, format, substitutions):
        data = []
        for x in x_values:
            for y in y_values:
                data.append((x, y))

        # filter out very large integers for some operations so as not
        # to crash CPython
        data = [(x, y) for x, y in data
                if not (function == 'pow' and
                        x.lstrip('-').isdigit() and
                        y.lstrip('-').isdigit() and
                        (abs(int(x)) > 8192 or abs(int(y)) > 8192))]

        self.assertCodeExecution(
            '##################################################\n'.join(
                adjust("""
                    try:
                        print('>>> f = %(f)s')
                        print('>>> x = %(x)s')
                        print('>>> y = %(y)s')
                        print('>>> %(format)s%(operation)s')
                        f = %(f)s
                        x = %(x)s
                        y = %(y)s
                        print('|||', %(format)s%(operation)s)
                    except Exception as e:
                        print('///', type(e), ':', e)
                    print()
                    """ % {
                    'f': function,
                    'x': x,
                    'y': y,
                    'operation': operation,
                    'format': format,
                }
                       )
                for x, y in data
            ),
            "Error running %s" % operation,
            substitutions=substitutions,
            run_in_function=False,
            )

    for datatype1, examples1 in SAMPLE_DATA.items():
        for datatype2, examples2 in SAMPLE_DATA.items():
            vars()['test_%s_%s' % (datatype1, datatype2)] = _builtin_twoarg_test(
                'test_%s_%s' % (datatype1, datatype2),
                'f(x, y)', examples1, examples2
            )
