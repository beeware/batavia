from .. utils import TranspileTestCase, UnaryOperationTestCase, BinaryOperationTestCase, InplaceOperationTestCase

import unittest


class RangeTests(TranspileTestCase):
    def test_lengths(self):
        self.assertCodeExecution("""
            print("len(range(0, 10)) =", len(range(0, 10)))
            print("len(range(0, 10, 2)) =", len(range(0, 10, 2)))
            print("len(range(0, 11, 2)) =", len(range(0, 11, 2)))
            print("len(range(-10, 0)) =", len(range(-10, 0)))
            print("len(range(10, 0, -1)) =", len(range(10, 0, -1)))
            print("len(range(10, 0, -2)) =", len(range(10, 0, -2)))
            print("len(range(11, 0, -2)) =", len(range(11, 0, -2)))
            print("len(range(0, -10, -1)) =", len(range(0, -10, -1)))
            print("len(range(0, 5, 2)) =", len(range(0, 5, 2)))
            print("len(range(7, -6, -3)) =", len(range(7, -6, -3)))
            print("len(range(1, 10, -1)) =", len(range(1, 10, -1)))
            print("len(range(10, 0, 1)) =", len(range(10, 0, 1)))
            """)

    def test_creation(self):
        self.assertCodeExecution("""
            x = range(0, 5)
            print("x[0] =", x[0])
            print("x[1] =", x[1])
            print("x[3] =", x[3])
            print("x[-1] =", x[-1])
            print("x[5] =", x[5])
            """)

    def test_start_not_zero(self):
        self.assertCodeExecution("""
            x = range(5, 10)
            print("x[0] =", x[0])
            print("x[1] =", x[1])
            print("x[3] =", x[3])
            print("x[-1] =", x[-1])
            print("x[5] =", x[5])
            """)

    def test_step(self):
        self.assertCodeExecution("""
            x = range(0, 5, 2)
            print("x[0] =", x[0])
            print("x[1] =", x[1])
            print("x[3] =", x[3])
            print("x[-1] =", x[-1])
            print("x[5] =", x[5])
            """)

    def test_step_negative(self):
        self.assertCodeExecution("""
            x = range(7, -5, -2)
            print("x[0] =", x[0])
            print("x[1] =", x[1])
            print("x[3] =", x[3])
            print("x[-1] =", x[-1])
            print("x[5] =", x[5])
            """)

    def test_start_negative(self):
        self.assertCodeExecution("""
            x = range(-10, 0)
            print("x[0] =", x[0])
            print("x[1] =", x[1])
            print("x[3] =", x[3])
            print("x[-1] =", x[-1])
            print("x[5] =", x[5])
            """)

    def test_slice_simple(self):
        self.assertCodeExecution("""
            x = range(-10, 10)
            print("x[0:5] =", x[0:5])
            print("x[2:5] =", x[2:5])
            print("x[5:10] =", x[5:10])
            print("x[12:12] =", x[12:12])
            """)

    def test_slice_step(self):
        self.assertCodeExecution("""
            x = range(-10, 10)
            print("x[0:5:2] =", x[0:5:2])
            print("x[2:5:2] =", x[2:5:2])
            print("x[5:10:2] =", x[5:10:2])
            print("x[0:5:-2] =", x[0:5:-2])
            print("x[2:5:-2] =", x[2:5:-2])
            print("x[25:21:-2] =", x[25:21:-2])
            """)

    def test_slice_incomplete(self):
        self.assertCodeExecution("""
            x = range(-10, 10)
            print("x[:5:2] =", x[:5:2])
            print("x[2::2] =", x[2::2])
            print("x[::2] =", x[::2])
            print("x[:5:-2] =", x[:5:-2])
            print("x[2::-2] =", x[2::-2])
            print("x[::-2] =", x[::-2])
            """)

    def test_slice_edge_cases_negative(self):
        self.assertCodeExecution("""
            print("range(2, 7, 3)[8:8:-2] =", range(2, 7, 3)[8:8:-2])
            print("range(2, 7, 3)[-8:-8:-2] =", range(2, 7, 3)[-8:-8:-2])

            print("range(7, 2, 1)[8:8:-2] =", range(7, 2, 1)[8:8:-2])
            print("range(7, 2, 1)[-8:-8:-2] =", range(7, 2, 1)[-8:-8:-2])

            print("range(7, 2, -1)[8:8:-2] =", range(7, 2, -1)[8:8:-2])
            print("range(7, 2, -1)[-8:-8:-2] =", range(7, 2, -1)[-8:-8:-2])

            print("range(2, 7, -1)[8:8:-2] =", range(2, 7, -1)[8:8:-2])
            print("range(2, 7, -1)[-8:-8:-2] =", range(2, 7, -1)[-8:-8:-2])
            """)

    def test_slice_edge_cases_positive(self):
        self.assertCodeExecution("""
            print("range(2, 7, 2)[8:8] =", range(2, 7, 2)[8:8])
            print("range(2, 7, 2)[-8:-8] =", range(2, 7, 2)[-8:-8])

            print("range(7, 2, 1)[8:8] =", range(7, 2, 1)[8:8])
            print("range(7, 2, 1)[-8:-8] =", range(7, 2, 1)[-8:-8])

            print("range(7, 2, -1)[8:8] =", range(7, 2, -1)[8:8])
            print("range(7, 2, -1)[-8:-8] =", range(7, 2, -1)[-8:-8])

            print("range(2, 7, -1)[8:8] =", range(2, 7, -1)[8:8])
            print("range(2, 7, -1)[-8:-8] =", range(2, 7, -1)[-8:-8])
            """)

    def test_slice_edge_cases_incomplete(self):
        self.assertCodeExecution("""
            print("range(2, 7, 2)[::] =", range(2, 7, 2)[::])
            print("range(7, 2, 1)[::] =", range(7, 2, 1)[::])
            print("range(7, 2, -1)[::] =", range(7, 2, -1)[::])
            print("range(2, 7, -1)[::] =", range(2, 7, -1)[::])

            print("range(2, 7, 2)[::-1] =", range(2, 7, 2)[::-1])
            print("range(7, 2, 1)[::-1] =", range(7, 2, 1)[::-1])
            print("range(7, 2, -1)[::-1] =", range(7, 2, -1)[::-1])
            print("range(2, 7, -1)[::-1] =", range(2, 7, -1)[::-1])
            """)


class UnaryRangeOperationTests(UnaryOperationTestCase, TranspileTestCase):
    data_type = 'range'

    not_implemented = [
        'test_unary_not',
    ]


class BinaryRangeOperationTests(BinaryOperationTestCase, TranspileTestCase):
    data_type = 'range'

    not_implemented = [
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

        'test_eq_range',

        'test_ge_bool',
        'test_ge_bytearray',
        'test_ge_bytes',
        'test_ge_class',
        'test_ge_complex',
        'test_ge_dict',
        'test_ge_float',
        'test_ge_frozenset',
        'test_ge_int',
        'test_ge_list',
        'test_ge_None',
        'test_ge_NotImplemented',
        'test_ge_range',
        'test_ge_set',
        'test_ge_slice',
        'test_ge_str',
        'test_ge_tuple',

        'test_gt_bool',
        'test_gt_bytearray',
        'test_gt_bytes',
        'test_gt_class',
        'test_gt_complex',
        'test_gt_dict',
        'test_gt_float',
        'test_gt_frozenset',
        'test_gt_int',
        'test_gt_list',
        'test_gt_None',
        'test_gt_NotImplemented',
        'test_gt_range',
        'test_gt_set',
        'test_gt_slice',
        'test_gt_str',
        'test_gt_tuple',

        'test_le_bool',
        'test_le_bytearray',
        'test_le_bytes',
        'test_le_class',
        'test_le_complex',
        'test_le_dict',
        'test_le_float',
        'test_le_frozenset',
        'test_le_int',
        'test_le_list',
        'test_le_None',
        'test_le_NotImplemented',
        'test_le_range',
        'test_le_set',
        'test_le_slice',
        'test_le_str',
        'test_le_tuple',


        'test_lt_bool',
        'test_lt_bytearray',
        'test_lt_bytes',
        'test_lt_class',
        'test_lt_complex',
        'test_lt_dict',
        'test_lt_float',
        'test_lt_frozenset',
        'test_lt_int',
        'test_lt_list',
        'test_lt_None',
        'test_lt_NotImplemented',
        'test_lt_range',
        'test_lt_set',
        'test_lt_slice',
        'test_lt_str',
        'test_lt_tuple',

        'test_ne_range',
    ]


class InplaceRangeOperationTests(InplaceOperationTestCase, TranspileTestCase):
    data_type = 'range'

    not_implemented = [
        'test_multiply_bytearray',
        'test_multiply_bytes',
        'test_multiply_list',
        'test_multiply_str',
        'test_multiply_tuple',
    ]
