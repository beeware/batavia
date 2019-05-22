from ..utils import TranspileTestCase, UnaryOperationTestCase, BinaryOperationTestCase, InplaceOperationTestCase, \
    MagicMethodFunctionTestCase

import unittest


class SetTests(TranspileTestCase):
    def test_set_of_ints_and_strs(self):
        self.assertCodeExecution("""
            print(set([1, "1"]))
            """, substitutions={"{1, '1'}": ["{'1', 1}"]})

    @unittest.expectedFailure
    def test_setattr(self):
        self.assertCodeExecution("""
            x = {1, 2, 3}
            x.attr = 42
            print('Done.')
            """)

    def test_getattr(self):
        self.assertCodeExecution("""
            x = {1, 2, 3}
            print(x.attr)
            print('Done.')
            """)

    def test_len(self):
        self.assertCodeExecution("""
        print(len(set()))
        print(type(len(set())))
        print(len({1,2,3}))
        """)

    def test_creation(self):
        # Empty set
        self.assertCodeExecution("""
            x = set()
            print(x)
            """)

        # Set constant
        self.assertCodeExecution("""
            x = {'a'}
            print(x)
            """)

        self.assertCodeExecution("""
            x = set(['a'])
            print(x)
            """)

    def test_getitem(self):
        # Simple existent key
        self.assertCodeExecution("""
            x = {'a', 'b'}
            print('a' in x)
            """)

        # Simple non-existent key
        self.assertCodeExecution("""
            x = {'a', 'b'}
            print('c' in x)
            """)

    def test_iter(self):
        self.assertCodeExecution("""
            print(list(iter(set([]))))
            print(list(iter({1, 2})))
            """)


class MagicMethodFunctionTests(MagicMethodFunctionTestCase, TranspileTestCase):
    data_type = 'set'

    not_implemented = [
        "test_rsubtract_frozenset",
        "test_rsubtract_set",
    ]


class UnarySetOperationTests(UnaryOperationTestCase, TranspileTestCase):
    data_type = 'set'


class BinarySetOperationTests(BinaryOperationTestCase, TranspileTestCase):
    data_type = 'set'

    not_implemented = [
        # Incorrect error message shown (unsupported operands vs can't multiply sequence by non-int)
        "test_multiply_bytearray",
        "test_multiply_bytes",
    ]


class InplaceSetOperationTests(InplaceOperationTestCase, TranspileTestCase):
    data_type = 'set'

    not_implemented = [
        "test_multiply_list",
        "test_multiply_str",
        "test_multiply_tuple",
        "test_multiply_bytes",
    ]
