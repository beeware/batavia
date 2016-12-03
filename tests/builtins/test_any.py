from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class AnyTests(TranspileTestCase):

    def test_any(self):
        self.assertCodeExecution("print(any([None, True, False]))")

    def test_any_true(self):
        self.assertCodeExecution("print(any([1,True,3]))")

    def test_any_false(self):
        self.assertCodeExecution("print(any([0, '', 0.0]))")

    def test_any_empty_list(self):
        self.assertCodeExecution("print(any([]))")

    def test_any_typeerror(self):
        self.assertCodeExecution("print(any(None))")


class BuiltinAnyFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["any"]
