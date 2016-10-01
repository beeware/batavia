from .. utils import TranspileTestCase, UnaryOperationTestCase, BinaryOperationTestCase, InplaceOperationTestCase

import unittest


class DictTests(TranspileTestCase):
    @unittest.expectedFailure
    def test_setattr(self):
        self.assertCodeExecution("""
            x = {}
            x.attr = 42
            print('Done.')
            """)

    @unittest.expectedFailure
    def test_getattr(self):
        self.assertCodeExecution("""
            x = {}
            print(x.attr)
            print('Done.')
            """)

    def test_creation(self):
        # Empty dict
        self.assertCodeExecution("""
            x = {}
            print(x)
            """)

        # normal key
        self.assertCodeExecution("""
            x = {'a': 1}
            print(x)
            """)

        # keys with the same string representation
        self.assertCodeExecution("""
            x = {1: 2, '1': 1}
            print(x)
            """)

    def test_getitem(self):
        # Simple existent key
        self.assertCodeExecution("""
            y = 37
            x = {'a': 1, 'b': 2, 'c': y}
            print('a' in x)
            print('a' not in x)
            print(x['a'])
            """)

        # Simple non-existent key
        self.assertCodeExecution("""
            x = {'a': 1, 'b': 2}
            print('c' in x)
            print('c' not in x)
            print(x['c'])
            """, run_in_function=False)

    def test_clear(self):
        # Clear a dictionary
        self.assertCodeExecution("""
            x = {'a': 1, 'b': 2}
            print('a' in x)
            print(x.clear())
            print('a' not in x)
            print(x)
            """)

        # Clear an already empty dict
        self.assertCodeExecution("""
            x = {}
            print('a' not in x)
            print(x.clear())
            print('a' not in x)
            print(x)
            """)

    def test_builtin_constructor(self):
        # Construct a dictionary using the dict builtin
        self.assertCodeExecution("""
            x = dict()
            print(x)
            print('a' in x)

            # List of tuples
            x = dict([('a', 1), ('b', 2)])
            print('a' in x)
            print(x['a'])
            print('c' in x)

            # List of lists
            x = dict([['a', 3], ['b', 4]])
            print('a' in x)
            print(x['a'])
            print('c' in x)

            # Tuple of lists
            x = dict((['a', 5], ['b', 6]))
            print('a' in x)
            print(x['a'])
            print('c' in x)

            # Tuple of tuples
            x = dict((('a', 5), ('b', 6)))
            print('a' in x)
            print(x['a'])
            print('c' in x)
        """)

    def test_builtin_non_2_tuples(self):
        # One of the elements isn't a 2-tuple
        self.assertCodeExecution("""
            x = dict([('a', 1), ('b', 2, False)])
            """, run_in_function=False)

    def test_print_dict(self):
        """
        Primarily useful to assert that dict is able to be printed
        since bytecode has changed for dict creation between 3.4 and 3.5
        """
        self.assertCodeExecution("""
            foo = {'a': 1}
            print(foo)
            """)

    def test_print_dict_bytecode_34(self):
        # equivalent to
        #   foo = {'a': 1}
        #   print(foo)
        # we are using explicit bytecode here so that we can test
        # differences in Python bytecode between diff Py versions
        # within a single test suite
        bytecode = (
            b'7gwNCsmyUFcaAAAA4wAAAAAAAAAAAAAAAAMAAABAAAAAcxsAAABpAQBkAABkAQA2WgAAZQEAZQAA\n'
            b'gwEAAWQCAFMpA+kBAAAA2gFhTikC2gNmb2/aBXByaW50qQByBQAAAHIFAAAA+gd0ZXN0LnB52gg8\n'
            b'bW9kdWxlPgEAAABzAgAAAA0B\n'
        )
        expected = "{'a': 1}\n"
        self.assertJavaScriptExecution(bytecode, expected, js={})

    def test_print_dict_bytecode_35(self):
        # equivalent to
        #   foo = {'a': 1}
        #   print(foo)
        # we are using explicit bytecode here so that we can test
        # differences in Python bytecode between diff Py versions
        # within a single test suite
        bytecode = (
            b'Fg0NChCzUFcaAAAA4wAAAAAAAAAAAAAAAAIAAABAAAAAcxoAAABkAABkAQBpAQBaAABlAQBlAACD\n'
            b'AQABZAIAUykD2gFh6QEAAABOKQLaA2Zvb9oFcHJpbnSpAHIFAAAAcgUAAAD6B3Rlc3QucHnaCDxt\n'
            b'b2R1bGU+AQAAAHMCAAAADAE=\n'
        )
        expected = "{'a': 1}\n"
        self.assertJavaScriptExecution(bytecode, expected, js={})

    def test_builtin_non_sequence(self):
        # One of the elements isn't a sequence
        self.assertCodeExecution("""
            x = dict([('a', 1), False, ('b', 2)])
            """, run_in_function=False)


class UnaryDictOperationTests(UnaryOperationTestCase, TranspileTestCase):
    data_type = 'dict'


class BinaryDictOperationTests(BinaryOperationTestCase, TranspileTestCase):
    data_type = 'dict'

    not_implemented = [

        'test_eq_dict',

        'test_floor_divide_complex',

        'test_ge_bytearray',
        'test_ge_bytes',
        'test_ge_class',
        'test_ge_complex',
        'test_ge_frozenset',
        'test_ge_NotImplemented',
        'test_ge_range',
        'test_ge_set',
        'test_ge_slice',

        'test_gt_bytearray',
        'test_gt_bytes',
        'test_gt_class',
        'test_gt_complex',
        'test_gt_frozenset',
        'test_gt_NotImplemented',
        'test_gt_range',
        'test_gt_slice',

        'test_le_bytearray',
        'test_le_bytes',
        'test_le_class',
        'test_le_complex',
        'test_le_frozenset',
        'test_le_NotImplemented',
        'test_le_range',
        'test_le_set',
        'test_le_slice',

        'test_lshift_bool',
        'test_lshift_bytearray',
        'test_lshift_bytes',
        'test_lshift_class',
        'test_lshift_complex',
        'test_lshift_dict',
        'test_lshift_float',
        'test_lshift_frozenset',
        'test_lshift_int',
        'test_lshift_list',
        'test_lshift_None',
        'test_lshift_NotImplemented',
        'test_lshift_range',
        'test_lshift_set',
        'test_lshift_slice',
        'test_lshift_str',
        'test_lshift_tuple',

        'test_lt_bytearray',
        'test_lt_bytes',
        'test_lt_bytes',
        'test_lt_class',
        'test_lt_complex',
        'test_lt_frozenset',
        'test_lt_NotImplemented',
        'test_lt_range',
        'test_lt_set',
        'test_lt_slice',

        'test_modulo_bool',
        'test_modulo_bytearray',
        'test_modulo_bytes',
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

        'test_multiply_class',
        'test_multiply_complex',
        'test_multiply_frozenset',
        'test_multiply_NotImplemented',
        'test_multiply_range',
        'test_multiply_set',
        'test_multiply_slice',

        'test_ne_dict',

        'test_or_bool',
        'test_or_bytearray',
        'test_or_bytes',
        'test_or_bytes',
        'test_or_class',
        'test_or_complex',
        'test_or_dict',
        'test_or_float',
        'test_or_frozenset',
        'test_or_int',
        'test_or_list',
        'test_or_None',
        'test_or_NotImplemented',
        'test_or_range',
        'test_or_set',
        'test_or_slice',
        'test_or_str',
        'test_or_tuple',

        'test_rshift_bool',
        'test_rshift_bytearray',
        'test_rshift_bytes',
        'test_rshift_bytes',
        'test_rshift_class',
        'test_rshift_complex',
        'test_rshift_dict',
        'test_rshift_float',
        'test_rshift_frozenset',
        'test_rshift_int',
        'test_rshift_list',
        'test_rshift_None',
        'test_rshift_NotImplemented',
        'test_rshift_range',
        'test_rshift_set',
        'test_rshift_slice',
        'test_rshift_str',
        'test_rshift_tuple',

        'test_subscr_bytearray',
        'test_subscr_class',
        'test_subscr_dict',
        'test_subscr_None',
        'test_subscr_NotImplemented',
        'test_subscr_list',
        'test_subscr_range',
        'test_subscr_set',
        'test_subscr_slice',

        'test_xor_bool',
        'test_xor_bytearray',
        'test_xor_bytes',
        'test_xor_bytes',
        'test_xor_class',
        'test_xor_complex',
        'test_xor_dict',
        'test_xor_float',
        'test_xor_frozenset',
        'test_xor_int',
        'test_xor_list',
        'test_xor_None',
        'test_xor_NotImplemented',
        'test_xor_range',
        'test_xor_set',
        'test_xor_slice',
        'test_xor_str',
        'test_xor_tuple',
    ]


class InplaceDictOperationTests(InplaceOperationTestCase, TranspileTestCase):
    data_type = 'dict'

    not_implemented = [
        'test_add_bool',
        'test_add_bytearray',
        'test_add_bytes',
        'test_add_class',
        'test_add_complex',
        'test_add_dict',
        'test_add_float',
        'test_add_frozenset',
        'test_add_int',
        'test_add_list',
        'test_add_None',
        'test_add_NotImplemented',
        'test_add_range',
        'test_add_set',
        'test_add_slice',
        'test_add_str',
        'test_add_tuple',

        'test_and_bool',
        'test_and_bytearray',
        'test_and_bytes',
        'test_and_bytes',
        'test_and_class',
        'test_and_complex',
        'test_and_dict',
        'test_and_float',
        'test_and_frozenset',
        'test_and_int',
        'test_and_list',
        'test_and_None',
        'test_and_NotImplemented',
        'test_and_range',
        'test_and_set',
        'test_and_slice',
        'test_and_str',
        'test_and_tuple',

        'test_floor_divide_bool',
        'test_floor_divide_bytearray',
        'test_floor_divide_bytes',
        'test_floor_divide_bytes',
        'test_floor_divide_class',
        'test_floor_divide_complex',
        'test_floor_divide_dict',
        'test_floor_divide_float',
        'test_floor_divide_frozenset',
        'test_floor_divide_int',
        'test_floor_divide_list',
        'test_floor_divide_None',
        'test_floor_divide_NotImplemented',
        'test_floor_divide_range',
        'test_floor_divide_set',
        'test_floor_divide_slice',
        'test_floor_divide_str',
        'test_floor_divide_tuple',

        'test_lshift_bool',
        'test_lshift_bytearray',
        'test_lshift_bytes',
        'test_lshift_bytes',
        'test_lshift_class',
        'test_lshift_complex',
        'test_lshift_dict',
        'test_lshift_float',
        'test_lshift_frozenset',
        'test_lshift_int',
        'test_lshift_list',
        'test_lshift_None',
        'test_lshift_NotImplemented',
        'test_lshift_range',
        'test_lshift_set',
        'test_lshift_slice',
        'test_lshift_str',
        'test_lshift_tuple',

        'test_modulo_bool',
        'test_modulo_bytearray',
        'test_modulo_bytes',
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

        'test_multiply_bool',
        'test_multiply_bytearray',
        'test_multiply_bytes',
        'test_multiply_bytes',
        'test_multiply_class',
        'test_multiply_complex',
        'test_multiply_dict',
        'test_multiply_float',
        'test_multiply_frozenset',
        'test_multiply_int',
        'test_multiply_list',
        'test_multiply_None',
        'test_multiply_NotImplemented',
        'test_multiply_range',
        'test_multiply_set',
        'test_multiply_slice',
        'test_multiply_str',
        'test_multiply_tuple',

        'test_or_bool',
        'test_or_bytearray',
        'test_or_bytes',
        'test_or_bytes',
        'test_or_class',
        'test_or_complex',
        'test_or_dict',
        'test_or_float',
        'test_or_frozenset',
        'test_or_int',
        'test_or_list',
        'test_or_None',
        'test_or_NotImplemented',
        'test_or_range',
        'test_or_set',
        'test_or_slice',
        'test_or_str',
        'test_or_tuple',

        'test_power_bool',
        'test_power_bytearray',
        'test_power_bytes',
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

        'test_rshift_bool',
        'test_rshift_bytearray',
        'test_rshift_bytes',
        'test_rshift_bytes',
        'test_rshift_class',
        'test_rshift_complex',
        'test_rshift_dict',
        'test_rshift_float',
        'test_rshift_frozenset',
        'test_rshift_int',
        'test_rshift_list',
        'test_rshift_None',
        'test_rshift_NotImplemented',
        'test_rshift_range',
        'test_rshift_set',
        'test_rshift_slice',
        'test_rshift_str',
        'test_rshift_tuple',

        'test_subtract_bool',
        'test_subtract_bytearray',
        'test_subtract_bytes',
        'test_subtract_bytes',
        'test_subtract_class',
        'test_subtract_complex',
        'test_subtract_dict',
        'test_subtract_float',
        'test_subtract_frozenset',
        'test_subtract_int',
        'test_subtract_list',
        'test_subtract_None',
        'test_subtract_NotImplemented',
        'test_subtract_range',
        'test_subtract_set',
        'test_subtract_slice',
        'test_subtract_str',
        'test_subtract_tuple',

        'test_true_divide_bool',
        'test_true_divide_bytearray',
        'test_true_divide_bytes',
        'test_true_divide_bytes',
        'test_true_divide_class',
        'test_true_divide_complex',
        'test_true_divide_dict',
        'test_true_divide_float',
        'test_true_divide_frozenset',
        'test_true_divide_int',
        'test_true_divide_list',
        'test_true_divide_None',
        'test_true_divide_NotImplemented',
        'test_true_divide_range',
        'test_true_divide_set',
        'test_true_divide_slice',
        'test_true_divide_str',
        'test_true_divide_tuple',

        'test_xor_bool',
        'test_xor_bytearray',
        'test_xor_bytes',
        'test_xor_bytes',
        'test_xor_class',
        'test_xor_complex',
        'test_xor_dict',
        'test_xor_float',
        'test_xor_frozenset',
        'test_xor_int',
        'test_xor_list',
        'test_xor_None',
        'test_xor_NotImplemented',
        'test_xor_range',
        'test_xor_set',
        'test_xor_slice',
        'test_xor_str',
        'test_xor_tuple',
    ]
