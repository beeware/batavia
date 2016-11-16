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
        # These two work, but print floats not *quite* right due to JS
        # Python differences
        # TODO: re-implement the Python float printing function.

        'test_multiply_bytearray',
        'test_multiply_bytes',

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
    ]


class InplaceComplexOperationTests(InplaceOperationTestCase, TranspileTestCase):
    data_type = 'complex'

    not_implemented = [

        'test_multiply_bytearray',
        'test_multiply_bytes',

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
    ]
