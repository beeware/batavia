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
        self.assertCodeExecution("""
            try:
                print(all(None))
            except TypeError:
                print("Done.")
        """)

    def test_all_doc(self):
        self.assertCodeExecution("""
            print(all.__doc__)
        """)

    def test_all_sequence(self):
        self.assertCodeExecution("""
            class Sequence:
              def __init__(self, value):
                self.value = value
              def __len__(self):
                return len(self.value)
              def __getitem__(self, idx):
                return self.value[idx]

            not_all_values = Sequence([1,2,0,1])
            print(all(not_all_values))
            all_values = Sequence([1,2,3,1])
            print(all(all_values))
            no_values = Sequence([0,0,0])
            print(all(no_values))
        """)


class BuiltinAllFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "all"
