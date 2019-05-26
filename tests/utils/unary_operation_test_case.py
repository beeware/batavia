from .adjust import adjust
from .expected_failure import NotImplementedToExpectedFailure
from .samples import SAMPLE_SUBSTITUTIONS, SAMPLE_DATA


def _unary_test(test_name, operation):
    def func(self):
        self.assertUnaryOperation(
            x_values=SAMPLE_DATA[self.data_type],
            operation=operation,
            format=self.format,
            substitutions=getattr(self, 'substitutions', SAMPLE_SUBSTITUTIONS)
        )

    return func


class UnaryOperationTestCase(NotImplementedToExpectedFailure):
    format = ''

    def assertUnaryOperation(self, x_values, operation, format, substitutions):
        self.assertCodeExecution(
            '##################################################\n'.join(
                adjust("""
                    try:
                        print('>>> x = %(x)s')
                        print('>>> %(format)s%(operation)sx')
                        x = %(x)s
                        print('|||', %(format)s%(operation)sx)
                    except Exception as e:
                        print('///', type(e), ':', e)
                    print()
                    """ % {
                    'x': x,
                    'operation': operation,
                    'format': format,
                }
                       )
                for x in x_values
            ),
            "Error running %s" % operation,
            substitutions=substitutions,
            run_in_function=False,
        )

    test_unary_positive = _unary_test('test_unary_positive', '+')
    test_unary_negative = _unary_test('test_unary_negative', '-')
    test_unary_not = _unary_test('test_unary_not', 'not ')
    test_unary_invert = _unary_test('test_unary_invert', '~')
