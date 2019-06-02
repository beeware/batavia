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
        self.assertCodeExecution("""
            try:
                print(any(None))
            except TypeError as e:
                print(e)
                print('Done.')
        """)

    def test_any_doc(self):
        self.assertCodeExecution("""
            print(any.__doc__)
        """)

    def test_any_sequence(self):
        self.assertCodeExecution("""
            class Sequence:
              def __init__(self, value):
                self.value = value
              def __len__(self):
                return len(self.value)
              def __getitem__(self, idx):
                return self.value[idx]
                
            not_all_values = Sequence([1,2,0,1])
            print(any(not_all_values))
            all_values = Sequence([1,2,3,1])
            print(any(all_values))
            no_values = Sequence([0,0,0])
            print(any(no_values))
        """)



class BuiltinAnyFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "any"
