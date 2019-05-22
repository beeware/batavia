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

    not_implemented = [
        "test_rand_frozenset",
        "test_rand_set",
        "test_ror_frozenset",
        "test_ror_set",
        "test_rsubtract_frozenset",
        "test_rsubtract_set",
        "test_rxor_frozenset",
        "test_rxor_set",
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
