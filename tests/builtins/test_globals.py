from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class GlobalsTests(TranspileTestCase):
    def test_globals(self):
        self.assertCodeExecution("""
            # make sure we can get and modify globals
            print('x' not in globals())
            globals()['x'] = 1
            print('x' in globals())
            print(globals()['x'])
            print(x)
            """)


class BuiltinGlobalsFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["globals"]

    not_implemented = [
        'test_noargs',
    ]
