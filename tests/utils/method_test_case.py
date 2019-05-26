from .adjust import adjust
from .expected_failure import NotImplementedToExpectedFailure
from .samples import SAMPLE_DATA, SAMPLE_SUBSTITUTIONS


def _one_arg_method_test(name, module, cls_, f, examples):
    def func(self):
        self.assertOneArgMethod(
            name=name,
            module=module,
            cls_name=cls_,
            method_name=f,
            arg_values=examples,
            substitutions=getattr(self, 'substitutions', SAMPLE_SUBSTITUTIONS)
        )

    return func


class MethodTestCase(NotImplementedToExpectedFailure):
    def assertOneArgMethod(self, name, module, cls_name, method_name, arg_values, substitutions, **kwargs):
        self.assertCodeExecution(
            '##################################################\n'.join(
                adjust("""
                    try:
                        print('>>> import {m}')
                        print('>>> obj = {m}.{c}()')
                        print('>>> f = obj.{f}')
                        print('>>> x = {a}')
                        print('>>> f(x)')
                        import {m}
                        obj = {m}.{c}()
                        f = obj.{f}
                        x = {a}
                        print(f(x))
                    except Exception as e:
                        print('///', type(e), ':', e)
                    print()
                """.format(m=module, c=cls_name, f=method_name, a=arg))
                for arg in arg_values
            ),
            'Error running {} module {}'.format(module, name),
            substitutions=substitutions,
            run_in_function=False,
            **kwargs
        )

    @classmethod
    def add_one_arg_method_tests(test_cls, module, cls_name, functions):
        for func in functions:
            for datatype, examples in SAMPLE_DATA.items():
                name = 'test_{}_{}_{}_{}'.format(
                    module, cls_name, func, datatype
                )
                setattr(
                    test_cls,
                    name,
                    _one_arg_method_test(name, module, cls_name, func, examples)
                )
