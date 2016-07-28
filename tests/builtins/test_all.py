from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class AllTests(TranspileTestCase):
    
    def test_all(self):
        self.assertCodeExecution("print(all([None, True, False]))")

    def test_all_typeerror(self):
	self.assertCodeExecution("print(all(None))")


class BuiltinAllFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["all"]

    not_implemented = [
        'test_bytearray',
        'test_dict',
        'test_complex',
        'test_frozenset',
        'test_None',
        'test_NotImplemented',
        'test_range',
    ]
