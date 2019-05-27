from ..utils import TranspileTestCase, UnaryOperationTestCase, BinaryOperationTestCase, InplaceOperationTestCase, \
    MagicMethodFunctionTestCase


class NoneTypeTests(TranspileTestCase):
    def test_setattr(self):
        self.assertCodeExecution("""
            x = None
            try:
                x.thing = 42
            except AttributeError as e:
                print(e)
            print('Done.')
            """)

    def test_getattr(self):
        self.assertCodeExecution("""
            x = None
            try:
                y = x.thing
            except AttributeError as e:
                print(e)
            print('Done.')
            """)


class MagicMethodFunctionTests(MagicMethodFunctionTestCase, TranspileTestCase):
    data_type = 'None'
    MagicMethodFunctionTestCase._add_tests(vars(), None)


class UnaryNoneTypeOperationTests(UnaryOperationTestCase, TranspileTestCase):
    data_type = 'None'


class BinaryNoneTypeOperationTests(BinaryOperationTestCase, TranspileTestCase):
    data_type = 'None'

    not_implemented = [
        # Incorrect error message shown (unsupported operands vs can't multiply sequence by non-int)
        "test_multiply_bytearray",
        "test_multiply_bytes",
    ]


class InplaceNoneTypeOperationTests(InplaceOperationTestCase, TranspileTestCase):
    data_type = 'None'

    not_implemented = [
        # Incorrect error message shown (unsupported operands vs can't multiply sequence by non-int)
        "test_multiply_bytearray",
        "test_multiply_bytes",
    ]
