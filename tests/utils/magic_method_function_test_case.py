from .adjust_code import adjust
from .expected_failure import NotImplementedToExpectedFailure
from .samples import SAMPLE_SUBSTITUTIONS, SAMPLE_DATA

ALL_MAGIC_METHODS = ['__add__', '__and__', '__floordiv__', '__iadd__', '__iand__', '__ifloordiv__', '__ilshift__',
                     '__imatmul', '__imod__', '__imul__', '__ior__', '__ipow__', '__irshift__', '__isub__',
                     '__itruediv__', '__ixor__', '__lshift__', '__matmul__', '__mod__', '__mul__', '__or__', '__pow__',
                     '__radd__', '__rand__', '__rfloordiv__', '__rlshift__', '__rmod__', '__rmul__', '__ror__',
                     '__rpow__', '__rrshift__', '__rshift__', '__rsub__', '__rtruediv__', '__rxor__', '__sub__',
                     '__truediv__', '__xor__']


class MagicMethodFunctionTestCase(NotImplementedToExpectedFailure):
    format = ''
    expected_magic_methods = []

    def assertMagicMethodMissing(self, x_values, magic_method, format, substitutions):
        self.assertCodeExecution(
            '##################################################\n'.join(
                adjust("""
                        try:
                            print('>>> x = %(x)s')
                            print('>>> f = x.%(magic_method)s')
                            print('>>> %(format)sf')
                            x = %(x)s
                            f = x.%(magic_method)s
                            print('|||', %(format)sf)
                        except Exception as e:
                            print('///', type(e), ':', e)
                        print()
                        """ % {
                    'x': x,
                    'magic_method': magic_method,
                    'format': format,
                }
                       )
                for x in x_values
            ),
            "Error running %s" % magic_method,
            substitutions=substitutions,
            run_in_function=False,
        )

    def assertMagicMethod(self, x_values, magic_method, y_values, format, substitutions):
        data = []
        for x in x_values:
            for y in y_values:
                data.append((x, y))

        self.assertCodeExecution(
            '##################################################\n'.join(
                adjust("""
                    try:
                        print('>>> x = %(x)s')
                        x = %(x)s
                        print('>>> original_x = x')
                        original_x = x
                        print('>>> y = %(y)s')
                        y = %(y)s
                        print('>>> z = x.%(magic_method)s(y)')
                        z = x.%(magic_method)s(y)
                        print('>>> x')
                        print(x)
                        print('>>> original_x')
                        print(original_x)
                        print('>>> %(format)sz')
                        print('|||', %(format)sz)
                    except Exception as e:
                        print('///', type(e), ':', e)
                    print()
                    """ % {
                    'x': x,
                    'y': y,
                    'magic_method': magic_method,
                    'format': format,
                }
                       )
                for x, y in data
            ),
            "Error running %s" % magic_method,
            substitutions=substitutions,
            run_in_function=False,
        )

    @staticmethod
    def _magic_method_test(test_name, magic_method, examples, small_ints=False):
        def func(self):
            # CPython will attempt to malloc itself to death for some operations,
            # e.g., 1 << (2**32)
            # so we have this dirty hack
            actuals = examples
            if small_ints and test_name.endswith('_int'):
                actuals = [x for x in examples if abs(int(x)) < 8192]
            self.assertMagicMethod(
                x_values=SAMPLE_DATA[self.data_type][:2],
                y_values=actuals,
                magic_method=magic_method,
                format=self.format,
                substitutions=getattr(self, 'substitutions', SAMPLE_SUBSTITUTIONS)
            )

        return func

    @staticmethod
    def _magic_method_missing_test(magic_method):
        def func(self):
            self.assertMagicMethodMissing(
                magic_method=magic_method,
                x_values=SAMPLE_DATA[self.data_type][:2],
                format=self.format,
                substitutions=getattr(self, 'substitutions', SAMPLE_SUBSTITUTIONS))

        return func

    @staticmethod
    def _add_tests(vars, data_type_class):
        for magic_method in ALL_MAGIC_METHODS:
            if magic_method in dir(data_type_class):
                for datatype, examples in SAMPLE_DATA.items():
                    test_name = 'test%s%s' % (magic_method, datatype)
                    vars[test_name] = MagicMethodFunctionTestCase._magic_method_test(
                        test_name, magic_method, examples[:2], small_ints=True)
            else:
                vars['test%smissing' % magic_method] = MagicMethodFunctionTestCase._magic_method_missing_test(
                    magic_method)
