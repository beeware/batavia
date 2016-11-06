from .. utils import TranspileTestCase, UnaryOperationTestCase, BinaryOperationTestCase, InplaceOperationTestCase

import unittest


class FrozensetTests(TranspileTestCase):
    def test_creation(self):
        self.assertCodeExecution("""
            x = frozenset([1, 1, '1', '1'])
            print(x)
            """, substitutions={"{1, '1'}": ["{'1', 1}"]})


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
    ]
