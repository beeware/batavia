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
        'test_add_frozenset',

        'test_and_frozenset',

        'test_eq_frozenset',

        'test_floor_divide_complex',
        'test_floor_divide_frozenset',

        'test_ge_frozenset',

        'test_gt_frozenset',

        'test_le_frozenset',

        'test_lshift_frozenset',

        'test_lt_frozenset',

        'test_modulo_complex',
        'test_modulo_frozenset',

        'test_multiply_bytes',
        'test_multiply_bytearray',
        'test_multiply_frozenset',

        'test_ne_frozenset',

        'test_or_frozenset',

        'test_power_frozenset',

        'test_rshift_frozenset',

        'test_subscr_frozenset',

        'test_subtract_frozenset',

        'test_true_divide_frozenset',

        'test_xor_frozenset',
    ]


class InplaceNoneTypeOperationTests(InplaceOperationTestCase, TranspileTestCase):
    data_type = 'None'

    not_implemented = [
        'test_add_frozenset',

        'test_and_frozenset',

        'test_floor_divide_complex',
        'test_floor_divide_frozenset',

        'test_lshift_frozenset',

        'test_modulo_complex',
        'test_modulo_frozenset',

        'test_multiply_bytes',
        'test_multiply_bytearray',
        'test_multiply_frozenset',

        'test_or_frozenset',

        'test_power_frozenset',

        'test_rshift_frozenset',

        'test_subtract_frozenset',

        'test_true_divide_frozenset',

        'test_xor_frozenset',
    ]
