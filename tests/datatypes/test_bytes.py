from .. utils import TranspileTestCase, UnaryOperationTestCase, BinaryOperationTestCase, InplaceOperationTestCase

import unittest


class BytesTests(TranspileTestCase):
    def test_setattr(self):
        self.assertCodeExecution("""
            x = b'hello, world'
            x.attr = 42
            print('Done.')
            """)

    @unittest.expectedFailure
    def test_getattr(self):
        self.assertCodeExecution("""
            x = b'hello, world'
            print(x.attr)
            print('Done.')
            """)


class UnaryBytesOperationTests(UnaryOperationTestCase, TranspileTestCase):
    values = ['b""', 'b"This is a string of bytes"']

    not_implemented = [
        'test_unary_not',
    ]


class BinaryBytesOperationTests(BinaryOperationTestCase, TranspileTestCase):
    values = ['b""', 'b"This is a string of bytes"']

    not_implemented = [
        'test_add_bytearray',
        'test_add_bytes',
        'test_add_class',
        'test_add_complex',
        'test_add_frozenset',
        'test_add_set',
        'test_add_str',

        'test_and_bytearray',
        'test_and_complex',
        'test_and_frozenset',
        'test_and_set',

        'test_eq_bytearray',
        'test_eq_complex',
        'test_eq_frozenset',
        'test_eq_set',
        'test_eq_str',

        'test_floor_divide_bytearray',
        'test_floor_divide_complex',
        'test_floor_divide_frozenset',
        'test_floor_divide_set',

        'test_ge_bytearray',
        'test_ge_class',
        'test_ge_complex',
        'test_ge_frozenset',
        'test_ge_set',
        'test_ge_str',

        'test_gt_bytearray',
        'test_gt_class',
        'test_gt_complex',
        'test_gt_frozenset',
        'test_gt_set',
        'test_gt_str',

        'test_le_bytearray',
        'test_le_class',
        'test_le_complex',
        'test_le_frozenset',
        'test_le_set',
        'test_le_str',

        'test_lshift_bytearray',
        'test_lshift_complex',
        'test_lshift_frozenset',
        'test_lshift_set',

        'test_lt_bytearray',
        'test_lt_class',
        'test_lt_complex',
        'test_lt_frozenset',
        'test_lt_set',
        'test_lt_str',

        'test_modulo_bytearray',
        'test_modulo_class',
        'test_modulo_complex',
        'test_modulo_dict',
        'test_modulo_frozenset',
        'test_modulo_list',
        'test_modulo_set',

        'test_multiply_bool',
        'test_multiply_bytearray',
        'test_multiply_complex',
        'test_multiply_frozenset',
        'test_multiply_int',
        'test_multiply_set',

        'test_ne_bytearray',
        'test_ne_complex',
        'test_ne_frozenset',
        'test_ne_set',
        'test_ne_str',

        'test_or_bytearray',
        'test_or_complex',
        'test_or_frozenset',
        'test_or_set',

        'test_power_bytearray',
        'test_power_complex',
        'test_power_frozenset',
        'test_power_set',

        'test_rshift_bytearray',
        'test_rshift_complex',
        'test_rshift_frozenset',
        'test_rshift_set',

        'test_subscr_bool',
        'test_subscr_bytearray',
        'test_subscr_complex',
        'test_subscr_frozenset',
        'test_subscr_int',
        'test_subscr_set',

        'test_subtract_bytearray',
        'test_subtract_complex',
        'test_subtract_frozenset',
        'test_subtract_set',

        'test_true_divide_bytearray',
        'test_true_divide_complex',
        'test_true_divide_frozenset',
        'test_true_divide_set',

        'test_xor_bytearray',
        'test_xor_complex',
        'test_xor_frozenset',
        'test_xor_set',
    ]


class InplaceBytesOperationTests(InplaceOperationTestCase, TranspileTestCase):
    values = ['b""', 'b"This is a string of bytes"']

    not_implemented = [
        'test_add_bytearray',
        'test_add_bytes',
        'test_add_class',
        'test_add_complex',
        'test_add_frozenset',
        'test_add_set',
        'test_add_str',

        'test_and_bytearray',
        'test_and_class',
        'test_and_complex',
        'test_and_frozenset',
        'test_and_set',

        'test_floor_divide_bool',
        'test_floor_divide_bytearray',
        'test_floor_divide_bytes',
        'test_floor_divide_class',
        'test_floor_divide_complex',
        'test_floor_divide_dict',
        'test_floor_divide_float',
        'test_floor_divide_frozenset',
        'test_floor_divide_int',
        'test_floor_divide_list',
        'test_floor_divide_none',
        'test_floor_divide_set',
        'test_floor_divide_str',
        'test_floor_divide_tuple',

        'test_lshift_bool',
        'test_lshift_bytearray',
        'test_lshift_bytes',
        'test_lshift_class',
        'test_lshift_complex',
        'test_lshift_dict',
        'test_lshift_float',
        'test_lshift_frozenset',
        'test_lshift_int',
        'test_lshift_list',
        'test_lshift_none',
        'test_lshift_set',
        'test_lshift_str',
        'test_lshift_tuple',

        'test_modulo_bytearray',
        'test_modulo_complex',
        'test_modulo_dict',
        'test_modulo_frozenset',
        'test_modulo_list',
        'test_modulo_set',

        'test_multiply_bool',
        'test_multiply_bytearray',
        'test_multiply_bytes',
        'test_multiply_class',
        'test_multiply_complex',
        'test_multiply_dict',
        'test_multiply_float',
        'test_multiply_frozenset',
        'test_multiply_int',
        'test_multiply_list',
        'test_multiply_none',
        'test_multiply_set',
        'test_multiply_str',
        'test_multiply_tuple',

        'test_or_bytearray',
        'test_or_complex',
        'test_or_frozenset',
        'test_or_set',

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
        'test_power_none',
        'test_power_set',
        'test_power_str',
        'test_power_tuple',

        'test_rshift_bool',
        'test_rshift_bytearray',
        'test_rshift_bytes',
        'test_rshift_class',
        'test_rshift_complex',
        'test_rshift_dict',
        'test_rshift_float',
        'test_rshift_frozenset',
        'test_rshift_int',
        'test_rshift_list',
        'test_rshift_none',
        'test_rshift_set',
        'test_rshift_str',
        'test_rshift_tuple',

        'test_subtract_bytearray',
        'test_subtract_complex',
        'test_subtract_frozenset',
        'test_subtract_set',

        'test_true_divide_bytearray',
        'test_true_divide_bytes',
        'test_true_divide_class',
        'test_true_divide_complex',
        'test_true_divide_dict',
        'test_true_divide_float',
        'test_true_divide_frozenset',
        'test_true_divide_int',
        'test_true_divide_list',
        'test_true_divide_none',
        'test_true_divide_set',
        'test_true_divide_str',
        'test_true_divide_tuple',

        'test_xor_bytearray',
        'test_xor_complex',
        'test_xor_frozenset',
        'test_xor_set',
    ]
