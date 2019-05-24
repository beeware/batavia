from ..utils import TranspileTestCase, UnaryOperationTestCase, BinaryOperationTestCase, MagicMethodFunctionTestCase


class FrozensetTests(TranspileTestCase):
    def test_creation(self):
        self.assertCodeExecution("""
            x = frozenset([1, 1, '1', '1'])
            print(x)
            """, substitutions={"{1, '1'}": ["{'1', 1}"]})

    def test_len(self):
        self.assertCodeExecution("""
        print(len(frozenset()))
        print(type(len(frozenset())))
        print(len(frozenset([1, 2])))
        """)


class MagicMethodFunctionTests(MagicMethodFunctionTestCase, TranspileTestCase):
    data_type = 'frozenset'
    MagicMethodFunctionTestCase._add_tests(vars(), frozenset)

    not_implemented = [
        "test__rand__frozenset",
        "test__rand__set",
        "test__ror__frozenset",
        "test__ror__set",
        "test__rsub__frozenset",
        "test__rsub__set",
        "test__rxor__frozenset",
        "test__rxor__set",
    ]


class UnaryFrozensetOperationTests(UnaryOperationTestCase, TranspileTestCase):
    data_type = 'frozenset'


class BinaryFrozensetOperationTests(BinaryOperationTestCase, TranspileTestCase):
    data_type = 'frozenset'

    not_implemented = [
        # Incorrect error message shown (unsupported operands vs can't multiply sequence by non-int)
        "test_multiply_bytearray",
        "test_multiply_bytes",
    ]
