from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class AllTests(TranspileTestCase):

    def test_all(self):
        self.assertCodeExecution("print(all([None, True, False]))")

    def test_all_true(self):
        self.assertCodeExecution("print(all([1,True,3]))")

    def test_all_false(self):
        self.assertCodeExecution("print(all([0, '', 0.0]))")

    def test_all_empty_list(self):
        self.assertCodeExecution("print(all([]))")

    def test_all_typeerror(self):
        self.assertCodeExecution("print(all(None))")


class BuiltinAllFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["all"]

    not_implemented = [
        'test_range',
    ]
