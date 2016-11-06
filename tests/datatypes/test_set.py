from .. utils import TranspileTestCase, UnaryOperationTestCase, BinaryOperationTestCase, InplaceOperationTestCase

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

    @unittest.expectedFailure
    def test_getattr(self):
        self.assertCodeExecution("""
            x = {1, 2, 3}
            print(x.attr)
            print('Done.')
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

    @unittest.expectedFailure
    def test_iter(self):
        self.assertCodeExecution("""
            print(list(iter(set([]))))
            print(list(iter({1, 2})))
            """)



class UnarySetOperationTests(UnaryOperationTestCase, TranspileTestCase):
    data_type = 'set'

    not_implemented = [
        'test_unary_positive',
        'test_unary_negative',
        'test_unary_invert',
    ]


class BinarySetOperationTests(BinaryOperationTestCase, TranspileTestCase):
    data_type = 'set'

    not_implemented = [
        'test_ge_bytearray',
        'test_ge_bytes',
        'test_ge_class',
        'test_ge_complex',
        'test_ge_frozenset',
        'test_ge_NotImplemented',
        'test_ge_slice',

        'test_gt_bytearray',
        'test_gt_bytes',
        'test_gt_class',
        'test_gt_complex',
        'test_gt_frozenset',
        'test_gt_NotImplemented',
        'test_gt_slice',

        'test_le_bytearray',
        'test_le_bytes',
        'test_le_class',
        'test_le_complex',
        'test_le_frozenset',
        'test_le_NotImplemented',
        'test_le_slice',

        'test_lt_bytearray',
        'test_lt_bytes',
        'test_lt_class',
        'test_lt_complex',
        'test_lt_frozenset',
        'test_lt_NotImplemented',
        'test_lt_slice',
    ]


class InplaceSetOperationTests(InplaceOperationTestCase, TranspileTestCase):
    data_type = 'set'

    not_implemented = [
        'test_and_bytearray',
        'test_and_bytes',
        'test_and_class',
        'test_and_complex',
        'test_and_NotImplemented',

        'test_eq_bool',
        'test_eq_bytearray',
        'test_eq_bytes',
        'test_eq_class',
        'test_eq_complex',
        'test_eq_dict',
        'test_eq_float',
        'test_eq_frozenset',
        'test_eq_int',
        'test_eq_list',
        'test_eq_None',
        'test_eq_NotImplemented',
        'test_eq_range',
        'test_eq_set',
        'test_eq_slice',
        'test_eq_str',
        'test_eq_tuple',

        'test_ge_bool',
        'test_ge_bytearray',
        'test_ge_bytes',
        'test_ge_class',
        'test_ge_complex',
        'test_ge_dict',
        'test_ge_float',
        'test_ge_frozenset',
        'test_ge_int',
        'test_ge_list',
        'test_ge_None',
        'test_ge_NotImplemented',
        'test_ge_range',
        'test_ge_set',
        'test_ge_slice',
        'test_ge_str',
        'test_ge_tuple',

        'test_gt_bool',
        'test_gt_bytearray',
        'test_gt_bytes',
        'test_gt_class',
        'test_gt_complex',
        'test_gt_dict',
        'test_gt_float',
        'test_gt_frozenset',
        'test_gt_int',
        'test_gt_list',
        'test_gt_None',
        'test_gt_NotImplemented',
        'test_gt_range',
        'test_gt_set',
        'test_gt_slice',
        'test_gt_str',
        'test_gt_tuple',

        'test_le_bool',
        'test_le_bytearray',
        'test_le_bytes',
        'test_le_class',
        'test_le_complex',
        'test_le_dict',
        'test_le_float',
        'test_le_frozenset',
        'test_le_int',
        'test_le_list',
        'test_le_None',
        'test_le_NotImplemented',
        'test_le_range',
        'test_le_set',
        'test_le_slice',
        'test_le_str',
        'test_le_tuple',

        'test_lt_bool',
        'test_lt_bytearray',
        'test_lt_bytes',
        'test_lt_class',
        'test_lt_complex',
        'test_lt_dict',
        'test_lt_float',
        'test_lt_frozenset',
        'test_lt_int',
        'test_lt_list',
        'test_lt_None',
        'test_lt_NotImplemented',
        'test_lt_range',
        'test_lt_set',
        'test_lt_slice',
        'test_lt_str',
        'test_lt_tuple',

        'test_ne_bool',
        'test_ne_bytearray',
        'test_ne_bytes',
        'test_ne_class',
        'test_ne_complex',
        'test_ne_dict',
        'test_ne_float',
        'test_ne_frozenset',
        'test_ne_int',
        'test_ne_list',
        'test_ne_None',
        'test_ne_NotImplemented',
        'test_ne_range',
        'test_ne_set',
        'test_ne_slice',
        'test_ne_str',
        'test_ne_tuple',

        'test_subscr_bool',
        'test_subscr_bytearray',
        'test_subscr_bytes',
        'test_subscr_class',
        'test_subscr_complex',
        'test_subscr_dict',
        'test_subscr_float',
        'test_subscr_frozenset',
        'test_subscr_int',
        'test_subscr_list',
        'test_subscr_None',
        'test_subscr_NotImplemented',
        'test_subscr_range',
        'test_subscr_set',
        'test_subscr_slice',
        'test_subscr_str',
        'test_subscr_tuple',
    ]
