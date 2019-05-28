from .adjust_code import adjust
from .expected_failure import NotImplementedToExpectedFailure
from .samples import SAMPLE_SUBSTITUTIONS, SAMPLE_DATA


def _inplace_test(test_name, operation, examples, small_ints=False):
    def func(self):
        actuals = examples
        if small_ints and test_name.endswith('_int'):
            actuals = [x for x in examples if abs(int(x)) < 8192]
        self.assertInplaceOperation(
            x_values=SAMPLE_DATA[self.data_type],
            y_values=actuals,
            operation=operation,
            format=self.format,
            substitutions=getattr(self, 'substitutions', SAMPLE_SUBSTITUTIONS)
        )

    return func


class InplaceOperationTestCase(NotImplementedToExpectedFailure):
    format = ''
    y = 3

    def assertInplaceOperation(self, x_values, y_values, operation, format, substitutions):
        data = []
        for x in x_values:
            for y in y_values:
                data.append((x, y))

        self.assertCodeExecution(
            '##################################################\n'.join(
                adjust("""
                    try:
                        print('>>> x = %(x)s')
                        print('>>> y = %(y)s')
                        print('>>> %(operation)s')
                        print('>>> %(format)sx')
                        x = %(x)s
                        y = %(y)s
                        %(operation)s
                        print('|||', %(format)sx)
                    except Exception as e:
                        print('///', type(e), ':', e)
                    print()
                    """ % {
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

    for datatype, examples in SAMPLE_DATA.items():
        vars()['test_add_%s' % datatype] = _inplace_test(
            'test_add_%s' % datatype, 'x += y', examples
        )
        vars()['test_subtract_%s' % datatype] = _inplace_test(
            'test_subtract_%s' % datatype, 'x -= y', examples
        )
        vars()['test_multiply_%s' % datatype] = _inplace_test(
            'test_multiply_%s' % datatype, 'x *= y', examples, small_ints=True
        )
        vars()['test_floor_divide_%s' % datatype] = _inplace_test(
            'test_floor_divide_%s' % datatype, 'x //= y', examples
        )
        vars()['test_true_divide_%s' % datatype] = _inplace_test(
            'test_true_divide_%s' % datatype, 'x /= y', examples
        )
        vars()['test_modulo_%s' % datatype] = _inplace_test(
            'test_modulo_%s' % datatype, 'x %= y', examples
        )
        vars()['test_power_%s' % datatype] = _inplace_test(
            'test_power_%s' % datatype, 'x **= y', examples, small_ints=True
        )
        vars()['test_lshift_%s' % datatype] = _inplace_test(
            'test_lshift_%s' % datatype, 'x <<= y', examples, small_ints=True
        )
        vars()['test_rshift_%s' % datatype] = _inplace_test(
            'test_rshift_%s' % datatype, 'x >>= y', examples, small_ints=True
        )
        vars()['test_and_%s' % datatype] = _inplace_test(
            'test_and_%s' % datatype, 'x &= y', examples
        )
        vars()['test_xor_%s' % datatype] = _inplace_test(
            'test_xor_%s' % datatype, 'x ^= y', examples
        )
        vars()['test_or_%s' % datatype] = _inplace_test(
            'test_or_%s' % datatype, 'x |= y', examples
        )
