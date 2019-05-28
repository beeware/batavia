from .adjust_code import adjust
from .expected_failure import NotImplementedToExpectedFailure
from .samples import SAMPLE_DATA, SAMPLE_SUBSTITUTIONS

IGNORE_ORDER_DICTIONARY = {
    'tuple': ['set', 'frozenset', 'dict'],
    'list': ['set', 'frozenset', 'dict'],
}


def _builtin_test(test_name, datatype, operation, small_ints=False):
    def func(self):
        # bytes() gives implementation-dependent errors for sizes > 2**64,
        # we'll skip testing with those values rather than cargo-culting
        # the exact same exceptions
        examples = SAMPLE_DATA.get(datatype, ['"_noargs (should not be use)"'])
        if self.small_ints and test_name.endswith('_int'):
            examples = [x for x in examples if abs(int(x)) < 8192]

        selected_operation = operation
        if self.operation:
            selected_operation = self.operation

        transform_output = None
        ignore_order_cases = IGNORE_ORDER_DICTIONARY.get(self.function, [])
        if datatype in ignore_order_cases:
            transform_output = lambda x: set(x)  # NOQA

        self.assertBuiltinFunction(
            self.function,
            x_values=examples,
            operation=selected_operation,
            format=self.format,
            substitutions=getattr(self, 'substitutions', SAMPLE_SUBSTITUTIONS),
            transform_output=transform_output,
        )

    return func


class BuiltinFunctionTestCase(NotImplementedToExpectedFailure):
    format = ''
    operation = None
    substitutions = SAMPLE_SUBSTITUTIONS
    small_ints = False

    def assertBuiltinFunction(self, function, x_values, operation, format, substitutions, transform_output):
        self.assertCodeExecution(
            '##################################################\n'.join(
                adjust("""
                    try:
                        print('>>> f = %(f)s')
                        print('>>> x = %(x)s')
                        print('>>> %(format)s%(operation)s')
                        f = %(f)s
                        x = %(x)s
                        print('|||', %(format)s%(operation)s)
                    except Exception as e:
                        print('///', type(e), ':', e)
                    print()
                    """ % {
                    'f': function,
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
            transform_output=transform_output,
        )

    for datatype in SAMPLE_DATA.keys():
        vars()['test_%s' % datatype] = _builtin_test('test_%s' % datatype, datatype, 'f(x)')
    vars()['test_noargs'] = _builtin_test('test_noargs', None, 'f()')
