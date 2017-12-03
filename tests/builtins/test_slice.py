from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class SliceTests(TranspileTestCase):

    def test_slice_args(self):
        # no args
        self.assertCodeExecution("""
            print("slice() = ", slice())
        """)

        # too many args
        self.assertCodeExecution("""
            print("slice(1, 2, 3, 4) = ", slice(1, 2, 3, 4))
        """)

        # valid number of args
        self.assertCodeExecution("""
            print("slice(1) = ", slice(1, 2))
            print("slice(1, 2) = ", slice(1, 2, 3))
            print("slice(1, 2, 3, 4) = ", slice(1, 2, 3))
        """)

    def test_slice_arg_types(self):
        self.assertCodeExecution("""
            print("slice('a', 'b', 'c') = ", slice('a', 'b', 'c'))
            print("slice(None, None, None) =", slice(None, None, None))
            print("slice(0.2, 0.0, 1.0) =", slice(0.2, 0.0, 1.0))
        """)


class BuiltinSliceFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "slice"
