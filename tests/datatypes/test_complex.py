from .. utils import TranspileTestCase, UnaryOperationTestCase, BinaryOperationTestCase, InplaceOperationTestCase

import unittest


class ComplexTests(TranspileTestCase):
    @unittest.expectedFailure
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


class UnaryComplexOperationTests(UnaryOperationTestCase, TranspileTestCase):
    data_type = 'complex'

    not_implemented = [
    ]


class BinaryComplexOperationTests(BinaryOperationTestCase, TranspileTestCase):
    data_type = 'complex'

    not_implemented = [
        'test_add_frozenset',

        'test_and_frozenset',

        'test_eq_class',
        'test_eq_frozenset',

        'test_floor_divide_frozenset',

        'test_ge_frozenset',

        'test_gt_frozenset',

        'test_lt_frozenset',

        'test_lshift_frozenset',

        'test_le_frozenset',

        'test_modulo_frozenset',

        'test_multiply_bytearray',
        'test_multiply_frozenset',
        'test_multiply_bytes',

        'test_ne_class',
        'test_ne_frozenset',

        'test_or_frozenset',

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

        'test_rshift_frozenset',

        'test_subscr_frozenset',

        'test_subtract_frozenset',

        'test_true_divide_frozenset',

        'test_xor_frozenset',
    ]


class InplaceComplexOperationTests(InplaceOperationTestCase, TranspileTestCase):
    data_type = 'complex'

    not_implemented = [
        'test_add_frozenset',

        'test_and_frozenset',

        'test_floor_divide_frozenset',

        'test_lshift_frozenset',

        'test_modulo_frozenset',

        'test_multiply_bytearray',
        'test_multiply_frozenset',
        'test_multiply_bytes',

        'test_or_frozenset',

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

        'test_rshift_frozenset',

        'test_subtract_frozenset',

        'test_true_divide_frozenset',

        'test_xor_frozenset',
    ]
