from ..utils import TranspileTestCase, UnaryOperationTestCase, BinaryOperationTestCase, InplaceOperationTestCase, \
    MagicMethodFunctionTestCase

import unittest


class IntTests(TranspileTestCase):
    def test_setattr(self):
        self.assertCodeExecution("""
            x = 37
            x.attr = 42
            print('Done.')
            """)

    def test_getattr(self):
        self.assertCodeExecution("""
            x = 37
            print(x.attr)
            print('Done.')
            """)

    def test_invalid_literal(self):
        self.assertCodeExecution("""
            int('q', 16)
            """, run_in_function=False)

    def test_addition_promotes_past_32bits(self):
        self.assertCodeExecution("""
            print(0x80000000 + 1)
            """)

    def test_addition_promotes_past_64bits(self):
        self.assertCodeExecution("""
            print(0x7fffffffffffffff + 2)
            """)

    def test_subtraction_promotes_past_32bits(self):
        self.assertCodeExecution("""
            print(-0x7fffffff - 3)
            """)

    def test_subtraction_promotes_past_64bits(self):
        self.assertCodeExecution("""
            print(-0x7fffffffffffffff - 3)
            """)

    def test_multiplication_promotes(self):
        self.assertCodeExecution("""
            print(2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2+1)
            """)

    def test_pow_promotes(self):
        self.assertCodeExecution("""
            print((2**1024)+1)
            """)

    def test_comparisons_behave(self):
        self.assertCodeExecution("""
            print(((1 == 2) * -1) & ((1 == 2) * -1))
        """)


class MagicMethodFunctionTests(MagicMethodFunctionTestCase, TranspileTestCase):
    data_type = 'int'

    not_implemented = [
        "test_floor_divide_float",
        "test_modulo_float",
        "test_multiply_bytearray",
        "test_multiply_bytes",
        "test_multiply_list",
        "test_multiply_str",
        "test_multiply_tuple",
        "test_power_complex",
        "test_power_float",
        "test_subtract_float",
        "test_true_divide_complex",
        "test_true_divide_float",

        "test_rfloor_divide_bool",
        "test_rfloor_divide_int",
        "test_rlshift_bool",
        "test_rlshift_int",
        "test_rmodulo_bool",
        "test_rmodulo_int",
        "test_rmultiply_bytearray",
        "test_rmultiply_bytes",
        "test_rmultiply_list",
        "test_rmultiply_str",
        "test_rmultiply_tuple",
        "test_rpower_bool",
        "test_rpower_int",
        "test_rrshift_bool",
        "test_rrshift_int",
        "test_rsubtract_bool",
        "test_rsubtract_int",
        "test_rtrue_divide_bool",
        "test_rtrue_divide_int",
    ]


class UnaryIntOperationTests(UnaryOperationTestCase, TranspileTestCase):
    data_type = 'int'


class BinaryIntOperationTests(BinaryOperationTestCase, TranspileTestCase):
    data_type = 'int'

    not_implemented = [

        'test_power_float',

        'test_subtract_complex',

        'test_true_divide_complex',
    ]


class InplaceIntOperationTests(InplaceOperationTestCase, TranspileTestCase):
    data_type = 'int'

    not_implemented = [

        'test_power_float',

        'test_subtract_complex',

        'test_true_divide_complex',
    ]
