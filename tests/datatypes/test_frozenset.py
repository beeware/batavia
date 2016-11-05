from .. utils import TranspileTestCase, UnaryOperationTestCase, BinaryOperationTestCase, InplaceOperationTestCase

import unittest


class FrozensetTests(TranspileTestCase):
    pass


class UnaryFrozensetOperationTests(UnaryOperationTestCase, TranspileTestCase):
    data_type = 'frozenset'

    not_implemented = [
        'test_unary_positive',
        'test_unary_negative',
        'test_unary_invert',
    ]


class BinaryFrozensetOperationTests(BinaryOperationTestCase, TranspileTestCase):
    data_type = 'frozenset'

    not_implemented = [

        'test_ge_class',
        'test_ge_set',

        'test_gt_class',
        'test_gt_set',

        'test_le_class',
        'test_le_set',

        'test_lt_bytearray',
        'test_lt_bytes',
        'test_lt_class',
        'test_lt_complex',
        'test_lt_NotImplemented',
        'test_lt_set',
        'test_lt_slice',

        'test_or_bool',
        'test_or_bytearray',
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

        'test_subscr_bool',
        'test_subscr_bytearray',
        'test_subscr_bytes',
        'test_subscr_class',
        'test_subscr_complex',
        'test_subscr_dict',
        'test_subscr_float',
        'test_subscr_frozenset',
        'test_subscr_int',
        'test_subscr_list',
        'test_subscr_None',
        'test_subscr_NotImplemented',
        'test_subscr_range',
        'test_subscr_set',
        'test_subscr_slice',
        'test_subscr_str',
        'test_subscr_tuple',

        'test_subtract_bool',
        'test_subtract_bytearray',
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

        'test_xor_bool',
        'test_xor_bytearray',
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
