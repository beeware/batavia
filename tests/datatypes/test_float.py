from ..utils import TranspileTestCase, UnaryOperationTestCase, BinaryOperationTestCase, InplaceOperationTestCase, \
    MagicMethodFunctionTestCase

import unittest


class FloatTests(TranspileTestCase):
    @unittest.expectedFailure
    def test_setattr(self):
        self.assertCodeExecution("""
            x = 3.14159
            try:
                x.attr = 42
            except AttributeError as e:
                print(e)
            print('Done.')
            """)

    def test_getattr(self):
        self.assertCodeExecution("""
            x = 3.14159
            try:
                print(x.attr)
            except AttributeError as e:
                print(e)
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
    MagicMethodFunctionTestCase._add_tests(vars(), float)

    not_implemented = [
        "test__sub__complex",

        "test__rfloordiv__bool",
        "test__rfloordiv__float",
        "test__rfloordiv__int",
        "test__rmod__bool",
        "test__rmod__float",
        "test__rmod__int",
        "test__rpow__bool",
        "test__rpow__float",
        "test__rpow__int",
        "test__rsub__bool",
        "test__rsub__float",
        "test__rsub__int",
        "test__rtruediv__bool",
        "test__rtruediv__float",
        "test__rtruediv__int",
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
