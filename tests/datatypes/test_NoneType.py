from .. utils import TranspileTestCase, UnaryOperationTestCase, BinaryOperationTestCase, InplaceOperationTestCase

import unittest


class NoneTypeTests(TranspileTestCase):
    @unittest.expectedFailure
    def test_setattr(self):
        self.assertCodeExecution("""
            x = None
            x.thing = 42
            print('Done.')
            """)

    @unittest.expectedFailure
    def test_getattr(self):
        self.assertCodeExecution("""
            x = None
            y = x.thing
            print('Done.')
            """)


class UnaryNoneTypeOperationTests(UnaryOperationTestCase, TranspileTestCase):
    data_type = 'None'


class BinaryNoneTypeOperationTests(BinaryOperationTestCase, TranspileTestCase):
    data_type = 'None'

    not_implemented = [
        'test_add_bytearray',
        'test_add_bytes',
        'test_add_complex',
        'test_add_frozenset',

        'test_and_bool',
        'test_and_bytearray',
        'test_and_bytes',
        'test_and_class',
        'test_and_complex',
        'test_and_dict',
        'test_and_float',
        'test_and_frozenset',
        'test_and_int',
        'test_and_list',
        'test_and_None',
        'test_and_NotImplemented',
        'test_and_range',
        'test_and_set',
        'test_and_slice',
        'test_and_str',
        'test_and_tuple',

        'test_eq_bytearray',
        'test_eq_class',
        'test_eq_complex',
        'test_eq_frozenset',

        'test_floor_divide_bytearray',
        'test_floor_divide_bytes',
        'test_floor_divide_complex',
        'test_floor_divide_frozenset',

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

        'test_lshift_bytearray',
        'test_lshift_bytes',
        'test_lshift_complex',
        'test_lshift_frozenset',

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

        'test_modulo_bytearray',
        'test_modulo_bytes',
        'test_modulo_complex',
        'test_modulo_frozenset',

        'test_multiply_bytearray',
        'test_multiply_complex',
        'test_multiply_frozenset',

        'test_ne_bytearray',
        'test_ne_class',
        'test_ne_complex',
        'test_ne_frozenset',

        'test_or_bool',
        'test_or_bytearray',
        'test_or_bytes',
        'test_or_class',
        'test_or_complex',
        'test_or_dict',
        'test_or_float',
        'test_or_frozenset',
        'test_or_int',
        'test_or_list',
        'test_or_None',
        'test_or_NotImplemented',
        'test_or_range',
        'test_or_set',
        'test_or_slice',
        'test_or_str',
        'test_or_tuple',

        'test_power_bool',
        'test_power_bytearray',
        'test_power_bytes',
        'test_power_class',
        'test_power_complex',
        'test_power_dict',
        'test_power_float',
        'test_power_frozenset',
        'test_power_int',
        'test_power_list',
        'test_power_None',
        'test_power_NotImplemented',
        'test_power_range',
        'test_power_set',
        'test_power_slice',
        'test_power_str',
        'test_power_tuple',

        'test_rshift_bytearray',
        'test_rshift_bytes',
        'test_rshift_complex',
        'test_rshift_frozenset',

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

        'test_subtract_bytearray',
        'test_subtract_bytes',
        'test_subtract_complex',
        'test_subtract_frozenset',

        'test_true_divide_bytearray',
        'test_true_divide_bytes',
        'test_true_divide_complex',
        'test_true_divide_frozenset',

        'test_xor_bool',
        'test_xor_bytearray',
        'test_xor_bytes',
        'test_xor_class',
        'test_xor_complex',
        'test_xor_dict',
        'test_xor_float',
        'test_xor_frozenset',
        'test_xor_int',
        'test_xor_list',
        'test_xor_None',
        'test_xor_NotImplemented',
        'test_xor_range',
        'test_xor_set',
        'test_xor_slice',
        'test_xor_str',
        'test_xor_tuple',
    ]


class InplaceNoneTypeOperationTests(InplaceOperationTestCase, TranspileTestCase):
    data_type = 'None'

    not_implemented = [
        'test_add_bytearray',
        'test_add_bytes',
        'test_add_complex',
        'test_add_frozenset',

        'test_and_bytearray',
        'test_and_bytes',
        'test_and_complex',
        'test_and_frozenset',

        'test_floor_divide_bytearray',
        'test_floor_divide_bytes',
        'test_floor_divide_complex',
        'test_floor_divide_frozenset',

        'test_lshift_bytearray',
        'test_lshift_bytes',
        'test_lshift_complex',
        'test_lshift_frozenset',

        'test_modulo_bytearray',
        'test_modulo_bytes',
        'test_modulo_complex',
        'test_modulo_frozenset',

        'test_multiply_bytearray',
        'test_multiply_complex',
        'test_multiply_frozenset',

        'test_or_bytearray',
        'test_or_bytes',
        'test_or_complex',
        'test_or_frozenset',

        'test_power_bytearray',
        'test_power_bytes',
        'test_power_complex',
        'test_power_frozenset',

        'test_rshift_bytearray',
        'test_rshift_bytes',
        'test_rshift_complex',
        'test_rshift_frozenset',

        'test_subtract_bytearray',
        'test_subtract_bytes',
        'test_subtract_complex',
        'test_subtract_frozenset',

        'test_true_divide_bytearray',
        'test_true_divide_bytes',
        'test_true_divide_complex',
        'test_true_divide_frozenset',

        'test_xor_bytearray',
        'test_xor_bytes',
        'test_xor_complex',
        'test_xor_frozenset',
    ]
