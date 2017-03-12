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
        'test_unary_negative',
        'test_unary_invert',
    ]


class BinaryFrozensetOperationTests(BinaryOperationTestCase, TranspileTestCase):
    data_type = 'frozenset'
