from .. utils import TranspileTestCase, UnaryOperationTestCase, BinaryOperationTestCase, InplaceOperationTestCase

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


class UnaryIntOperationTests(UnaryOperationTestCase, TranspileTestCase):
    data_type = 'int'


class BinaryIntOperationTests(BinaryOperationTestCase, TranspileTestCase):
    data_type = 'int'

    not_implemented = [
        'test_multiply_complex',

        'test_power_float',

        'test_subtract_complex',

        'test_true_divide_complex',
    ]


class InplaceIntOperationTests(InplaceOperationTestCase, TranspileTestCase):
    data_type = 'int'

    not_implemented = [
        'test_floor_divide_complex',

        'test_modulo_complex',

        'test_multiply_complex',

        'test_power_float',

        'test_subtract_complex',

        'test_true_divide_complex',
    ]
