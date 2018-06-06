from unittest import expectedFailure

from .. utils import TranspileTestCase, BuiltinFunctionTestCase, BuiltinTwoargFunctionTestCase


class PowTests(TranspileTestCase):
    def test_int_z(self):
        self.assertCodeExecution("""
            x = 3
            y = 4
            z = 5
            print(pow(x, y, z))
        """)

    def test_int_neg_y_pos_z(self):
        self.assertCodeExecution("""
            x = 3
            y = -4
            z = 5
            print(pow(x, y, z))
        """)

    def test_int_neg_y_neg_z(self):
        self.assertCodeExecution("""
            x = 3
            y = -4
            z = -5
            print(pow(x, y, z))
        """)

    def test_int_y_zero_z_one(self):
        self.assertCodeExecution("""
            x = 1
            y = 0
            z = 1
            print(pow(x, y, z))
        """)

    def test_int_y_zero_z_neg_one(self):
        self.assertCodeExecution("""
            x = 1
            y = 0
            z = -1
            print(pow(x, y, z))
        """)

    def test_float_x_with_z(self):
        self.assertCodeExecution("""
            x = 3.3
            y = 4
            z = 5
            print(pow(x, y, z))
            """)

    def test_float_y_with_z(self):
        self.assertCodeExecution("""
            x = 3
            y = 4.4
            z = 5
            print(pow(x, y, z))
            """)

    def test_float(self):
        self.assertCodeExecution("""
            x = 3.3
            y = 4.4
            z = 5.5
            print(pow(x, y, z))
        """)

    def test_float_neg_y_with_z(self):
        self.assertCodeExecution("""
            x = 3.3
            y = -4.4
            z = 5.5
            print(pow(x, y, z))
        """)

    def test_huge_y(self):
        self.assertCodeExecution("""
            x = 2
            y = 1000000000
            z = 3
            print(pow(x, y, z))
            """)

    def test_lots_of_pows(self):
        self.assertCodeExecution("""
            print(pow(967, 441, 8))
            print(pow(911, 940, 583))
            print(pow(672, 84, 767))
            print(pow(237, 30, 789))
            print(pow(346, 623, 616))
            print(pow(148, 183, 115))
            print(pow(14, 487, 965))
            print(pow(64, 541, 466))
            print(pow(602, 89, 580))
            print(pow(269, 556, 645))
            print(pow(481, 355, 250))
            print(pow(934, 453, 531))
            print(pow(19, 508, 6))
            print(pow(143, 473, 378))
            print(pow(54, 588, 165))
            print(pow(557, 144, 938))
            print(pow(771, 957, 142))
            print(pow(305, 39, 277))
            print(pow(807, 177, 155))
            print(pow(955, 154, 834))
        """)


class BuiltinPowFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "pow"


class BuiltinTwoargPowFunctionTests(BuiltinTwoargFunctionTestCase, TranspileTestCase):
    function = "pow"

    not_implemented = [
        'test_bool_int',

        'test_bytearray_bool',
        'test_bytearray_bytearray',
        'test_bytearray_bytes',
        'test_bytearray_class',
        'test_bytearray_complex',
        'test_bytearray_dict',
        'test_bytearray_float',
        'test_bytearray_frozenset',
        'test_bytearray_int',
        'test_bytearray_list',
        'test_bytearray_None',
        'test_bytearray_NotImplemented',
        'test_bytearray_range',
        'test_bytearray_set',
        'test_bytearray_slice',
        'test_bytearray_str',
        'test_bytearray_tuple',

        'test_class_bool',
        'test_class_bytearray',
        'test_class_bytes',
        'test_class_class',
        'test_class_complex',
        'test_class_dict',
        'test_class_float',
        'test_class_frozenset',
        'test_class_int',
        'test_class_list',
        'test_class_None',
        'test_class_NotImplemented',
        'test_class_range',
        'test_class_set',
        'test_class_slice',
        'test_class_str',
        'test_class_tuple',

        'test_complex_complex',
        'test_complex_float',
        'test_complex_int',

        'test_float_complex',
        'test_float_float',
        'test_float_int',

        'test_int_float',

        'test_range_bool',
        'test_range_bytearray',
        'test_range_bytes',
        'test_range_class',
        'test_range_complex',
        'test_range_dict',
        'test_range_float',
        'test_range_frozenset',
        'test_range_int',
        'test_range_list',
        'test_range_None',
        'test_range_NotImplemented',
        'test_range_range',
        'test_range_set',
        'test_range_slice',
        'test_range_str',
        'test_range_tuple',
    ]
