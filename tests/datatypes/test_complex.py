from ..utils import TranspileTestCase, UnaryOperationTestCase, BinaryOperationTestCase, InplaceOperationTestCase, \
    MagicMethodFunctionTestCase

import unittest


class ComplexTests(TranspileTestCase):
    @unittest.expectedFailure
    def test_setattr(self):
        self.assertCodeExecution("""
            x = b'hello, world'
            x.attr = 42
            print('Done.')
            """)

    def test_getattr(self):
        self.assertCodeExecution("""
            x = b'hello, world'
            print(x.attr)
            print('Done.')
            """)


class MagicMethodFunctionTests(MagicMethodFunctionTestCase, TranspileTestCase):
    data_type = 'complex'

    not_implemented = [
        "test_power_complex",
        "test_power_float",
        "test_power_int",

        "test_rpower_bool",
        "test_rpower_complex",
        "test_rpower_float",
        "test_rpower_int",
        "test_rsubtract_bool",
        "test_rsubtract_complex",
        "test_rsubtract_float",
        "test_rsubtract_int",
        "test_rtrue_divide_bool",
        "test_rtrue_divide_complex",
        "test_rtrue_divide_float",
        "test_rtrue_divide_int",
    ]


class UnaryComplexOperationTests(UnaryOperationTestCase, TranspileTestCase):
    data_type = 'complex'


class BinaryComplexOperationTests(BinaryOperationTestCase, TranspileTestCase):
    data_type = 'complex'

    not_implemented = [
        # These two work, but print floats not *quite* right due to JS
        # Python differences
        # TODO: re-implement the Python float printing function.

        'test_power_complex',
        'test_power_float',
        'test_power_int',

        # Incorrect error message shown (unsupported operands vs can't multiply sequence by non-int)
        "test_multiply_bytearray",
        "test_multiply_bytes",
    ]


class InplaceComplexOperationTests(InplaceOperationTestCase, TranspileTestCase):
    data_type = 'complex'

    not_implemented = [
        # Incorrect error message shown (unsupported operands vs can't multiply sequence by non-int)
        "test_multiply_bytearray",
        "test_multiply_bytes",

        'test_power_complex',
        'test_power_float',
        'test_power_int',
    ]
