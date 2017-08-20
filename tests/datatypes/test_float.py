from .. utils import TranspileTestCase, UnaryOperationTestCase, BinaryOperationTestCase, InplaceOperationTestCase

import unittest


class FloatTests(TranspileTestCase):
    @unittest.expectedFailure
    def test_setattr(self):
        self.assertCodeExecution("""
            x = 3.14159
            x.attr = 42
            print('Done.')
            """)

    def test_getattr(self):
        self.assertCodeExecution("""
            x = 3.14159
            print(x.attr)
            print('Done.')
            """)

    def test_is_integer(self):
        self.assertCodeExecution("""
            print(3.14159.is_integer())
            print(3.0.is_integer())
            print('Done.')
            """)


class UnaryFloatOperationTests(UnaryOperationTestCase, TranspileTestCase):
    data_type = 'float'

    not_implemented = [
    ]


class BinaryFloatOperationTests(BinaryOperationTestCase, TranspileTestCase):
    data_type = 'float'

    not_implemented = [

        # these work, but print incorrectly

        'test_floor_divide_int',

        'test_true_divide_int',




        'test_floor_divide_complex',

        'test_ge_class',
        'test_ge_complex',
        'test_ge_frozenset',

        'test_gt_bytearray',
        'test_gt_bytes',
        'test_gt_class',
        'test_gt_complex',
        'test_gt_frozenset',

        'test_le_bytearray',
        'test_le_bytes',
        'test_le_class',
        'test_le_complex',
        'test_le_frozenset',

        'test_lt_class',
        'test_lt_complex',
        'test_lt_frozenset',

        'test_modulo_complex',

        'test_multiply_complex',

        'test_power_complex',
        'test_power_float',



        'test_true_divide_complex',
    ]


class InplaceFloatOperationTests(InplaceOperationTestCase, TranspileTestCase):
    data_type = 'float'

    not_implemented = [

        # these work, but print incorrectly

        'test_floor_divide_int',

        'test_true_divide_int',



        'test_floor_divide_complex',

        'test_modulo_complex',

        'test_multiply_bytes',
        'test_multiply_bytearray',
        'test_multiply_complex',

        'test_power_complex',
        'test_power_float',



        'test_true_divide_complex',
    ]
