from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class AbsTests(TranspileTestCase):
    def test_abs_not_implemented(self):
        self.assertCodeExecution("""
            class NotAbsLike:
                pass


            x = NotAbsLike()
            try:
                print(abs(x))
            except TypeError as e:
                print(e)
                print('Done.')
            """, run_in_function=False)


class BuiltinAbsFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "abs"
