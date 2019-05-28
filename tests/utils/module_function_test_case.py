from .adjust_code import adjust
from .expected_failure import NotImplementedToExpectedFailure
from .samples import SAMPLE_DATA, SAMPLE_SUBSTITUTIONS


def _module_one_arg_func_test(name, module, f, examples, small_ints=False):
    # Factorials can make us run out of memory and crash.
    # so we have this dirty hack
    actuals = examples
    if small_ints and name.endswith('_int'):
        actuals = [x for x in examples if abs(int(x)) < 8192]

    def func(self):
        self.assertOneArgModuleFunction(
            name=name,
            module=module,
            func=f,
            x_values=actuals,
            substitutions=getattr(self, 'substitutions', SAMPLE_SUBSTITUTIONS)
        )
    return func


def _module_two_arg_func_test(name, module, f,  examples, examples2):
    def func(self):
        self.assertTwoArgModuleFunction(
            name=name,
            module=module,
            func=f,
            x_values=examples,
            y_values=examples2,
            substitutions=getattr(self, 'substitutions', SAMPLE_SUBSTITUTIONS)

        )
    return func


numerics = {'bool', 'float', 'int'}


class ModuleFunctionTestCase(NotImplementedToExpectedFailure):
    numerics_only = False

    def assertOneArgModuleFunction(
        self, name, module, func, x_values, substitutions, **kwargs
    ):
        self.assertCodeExecution(
            '##################################################\n'.join(
                adjust("""
                    try:
                        print('>>> import %(m)s')
                        print('>>> f = %(m)s.%(f)s')
                        print('>>> x = %(x)s')
                        print('>>> f(x)')
                        import %(m)s
                        f = %(m)s.%(f)s
                        x = %(x)s
                        print(f(x))
                    except Exception as e:
                        print('///', type(e), ':', e)
                    print()
                    """ % {
                    'f': func,
                    'x': x,
                    'm': module,
                }
                       )
                for x in x_values
            ),
            "Error running %s module %s" % (module, name),
            substitutions=substitutions,
            run_in_function=False,
            **kwargs
        )

    def assertTwoArgModuleFunction(
        self, name, module, func, x_values, y_values, substitutions, **kwargs
    ):
        self.assertCodeExecution(
            '##################################################\n'.join(
                adjust("""
                    try:
                        print('>>> import %(m)s')
                        print('>>> f = %(m)s.%(f)s')
                        print('>>> x = %(x)s')
                        print('>>> y = %(y)s')
                        print('>>> f(x, y)')
                        import %(m)s
                        f = %(m)s.%(f)s
                        x = %(x)s
                        y = %(y)s
                        print(f(x, y))
                    except Exception as e:
                        print('///', type(e), ':', e)
                    print()
                    """ % {
                    'f': func,
                    'x': x,
                    'y': y,
                    'm': module,
                }
                       )
                for x in x_values for y in y_values
            ),
            "Error running %s module %s" % (module, name),
            substitutions=substitutions,
            run_in_function=False,
            **kwargs
        )

    @classmethod
    def add_one_arg_tests(klass, module, functions, numerics_only=False):
        for func in functions:
            for datatype, examples in SAMPLE_DATA.items():
                if numerics_only and datatype not in numerics:
                    continue
                name = 'test_%s_%s_%s' % (module, func, datatype)
                small_ints = module == 'math' and func == 'factorial'
                setattr(klass, name, _module_one_arg_func_test(name, module, func, examples, small_ints=small_ints))

    @classmethod
    def add_two_arg_tests(klass, module, functions, numerics_only=False):
        for func in functions:
            for datatype, examples in SAMPLE_DATA.items():
                if numerics_only and datatype not in numerics:
                    continue
                for datatype2, examples2 in SAMPLE_DATA.items():
                    if numerics_only and datatype2 not in numerics:
                        continue
                    name = 'test_%s_%s_%s_%s' % (module, func, datatype, datatype2)
                    setattr(klass, name, _module_two_arg_func_test(name, module, func, examples, examples2))
