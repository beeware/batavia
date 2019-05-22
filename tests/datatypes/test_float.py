from ..utils import TranspileTestCase, UnaryOperationTestCase, BinaryOperationTestCase, InplaceOperationTestCase, \
    MagicMethodFunctionTestCase

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


class MagicMethodFunctionTests(MagicMethodFunctionTestCase, TranspileTestCase):
    data_type = 'float'

    not_implemented = [
        "test_subtract_complex",

        "test_rfloor_divide_bool",
        "test_rfloor_divide_float",
        "test_rfloor_divide_int",
        "test_rmodulo_bool",
        "test_rmodulo_float",
        "test_rmodulo_int",
        "test_rpower_bool",
        "test_rpower_float",
        "test_rpower_int",
        "test_rsubtract_bool",
        "test_rsubtract_float",
        "test_rsubtract_int",
        "test_rtrue_divide_bool",
        "test_rtrue_divide_float",
        "test_rtrue_divide_int",
    ]


class UnaryFloatOperationTests(UnaryOperationTestCase, TranspileTestCase):
    data_type = 'float'


class BinaryFloatOperationTests(BinaryOperationTestCase, TranspileTestCase):
    data_type = 'float'

    not_implemented = [

        # these work, but print incorrectly

        'test_floor_divide_int',

        'test_true_divide_int',

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

        'test_power_complex',
        'test_power_float',

        'test_true_divide_complex',

        # Incorrect error message shown (unsupported operands vs can't multiply sequence by non-int)
        "test_multiply_bytearray",
        "test_multiply_bytes",
    ]


class InplaceFloatOperationTests(InplaceOperationTestCase, TranspileTestCase):
    data_type = 'float'

    not_implemented = [
        # Incorrect error message shown (unsupported operands vs can't multiply sequence by non-int)
        "test_multiply_bytearray",
        "test_multiply_bytes",

        # these work, but print incorrectly

        'test_floor_divide_int',

        'test_true_divide_int',

        'test_power_complex',
        'test_power_float',

        'test_true_divide_complex',
    ]
