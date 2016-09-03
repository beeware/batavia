from .. utils import TranspileTestCase, UnaryOperationTestCase, BinaryOperationTestCase, InplaceOperationTestCase

import unittest


class StrTests(TranspileTestCase):
    def test_setattr(self):
        self.assertCodeExecution("""
            x = "Hello, world"
            x.attr = 42
            print('Done.')
            """)

    @unittest.expectedFailure
    def test_getattr(self):
        self.assertCodeExecution("""
            x = "Hello, world"
            print(x.attr)
            print('Done.')
            """)

    def test_getitem(self):
        # Simple positive index
        self.assertCodeExecution("""
            x = 'abcde'
            print(x[2])
            """)

        # Simple negative index
        self.assertCodeExecution("""
            x = 'abcde'
            print(x[-2])
            """)

        # Positive index out of range
        self.assertCodeExecution("""
            x = 'abcde'
            print(x[10])
            """)

        # Negative index out of range
        self.assertCodeExecution("""
            x = 'abcde'
            print(x[-10])
            """)

    def test_slice(self):
        # Full slice
        self.assertCodeExecution("""
            x = 'abcde'
            print(x[:])
            """)

        # Left bound slice
        self.assertCodeExecution("""
            x = 'abcde'
            print(x[1:])
            """)

        # Right bound slice
        self.assertCodeExecution("""
            x = 'abcde'
            print(x[:4])
            """)

        # Slice bound in both directions
        self.assertCodeExecution("""
            x = 'abcde'
            print(x[1:4])
            """)

        # Slice with step 0 (error)
        self.assertCodeExecution("""
            x = 'abcde'
            print(x[::0])
            """)

        # Slice with revese step
        self.assertCodeExecution("""
            x = 'abcde'
            print(x[::-1])
            """)

        # Slice -1 stop with reverse step
        self.assertCodeExecution("""
            x = 'abcde'
            print(x[-5:-1:-1])
            """)

        # Slice -1 start with revese step
        self.assertCodeExecution("""
            x = 'abcde'
            print(x[-1:0:-1])
            """)


class UnaryStrOperationTests(UnaryOperationTestCase, TranspileTestCase):
    data_type = 'str'



class BinaryStrOperationTests(BinaryOperationTestCase, TranspileTestCase):
    data_type = 'str'

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

        'test_modulo_bool',
        'test_modulo_bytearray',
        'test_modulo_bytes',
        'test_modulo_class',
        'test_modulo_complex',
        'test_modulo_dict',
        'test_modulo_float',
        'test_modulo_frozenset',
        'test_modulo_int',
        'test_modulo_list',
        'test_modulo_None',
        'test_modulo_NotImplemented',
        'test_modulo_range',
        'test_modulo_set',
        'test_modulo_slice',
        'test_modulo_str',
        'test_modulo_tuple',

        'test_multiply_frozenset',

        'test_ne_frozenset',

        'test_or_frozenset',

        'test_power_frozenset',

        'test_rshift_frozenset',

        'test_subscr_bool',
        'test_subscr_frozenset',

        'test_subtract_frozenset',

        'test_true_divide_frozenset',

        'test_xor_frozenset',
    ]


class InplaceStrOperationTests(InplaceOperationTestCase, TranspileTestCase):
    data_type = 'str'

    not_implemented = [
        'test_add_frozenset',

        'test_and_frozenset',

        'test_floor_divide_frozenset',

        'test_lshift_frozenset',

        'test_modulo_bool',
        'test_modulo_bytearray',
        'test_modulo_bytes',
        'test_modulo_class',
        'test_modulo_complex',
        'test_modulo_dict',
        'test_modulo_float',
        'test_modulo_frozenset',
        'test_modulo_int',
        'test_modulo_list',
        'test_modulo_None',
        'test_modulo_NotImplemented',
        'test_modulo_range',
        'test_modulo_set',
        'test_modulo_slice',
        'test_modulo_str',
        'test_modulo_tuple',

        'test_multiply_frozenset',

        'test_or_frozenset',

        'test_power_frozenset',

        'test_rshift_frozenset',

        'test_subtract_frozenset',

        'test_true_divide_frozenset',

        'test_xor_frozenset',

    ]
