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

    @expectedFailure
    def test_int_neg_y_pos_z(self):
        self.assertCodeExecution("""
            x = 3
            y = -4
            z = 5
            print(pow(x, y, z))
        """)

    @expectedFailure
    def test_int_neg_y_neg_z(self):
        self.assertCodeExecution("""
            x = 3
            y = -4
            z = -5
            print(pow(x, y, z))
        """)

    @expectedFailure
    def test_float_x_with_z(self):
        self.assertCodeExecution("""
            x = 3.3
            y = 4
            z = 5
            print(pow(x, y, z))
            """)

    @expectedFailure
    def test_float_y_with_z(self):
        self.assertCodeExecution("""
            x = 3
            y = 4.4
            z = 5
            print(pow(x, y, z))
            """)

    @expectedFailure
    def test_float(self):
        self.assertCodeExecution("""
            x = 3.3
            y = 4.4
            z = 5.5
            print(pow(x, y, z))
        """)

    @expectedFailure
    def test_float_neg_y_with_z(self):
        self.assertCodeExecution("""
            x = 3.3
            y = -4.4
            z = 5.5
            print(pow(x, y, z))
        """)


class BuiltinPowFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["pow"]

    not_implemented = [
        'test_bytearray',
        'test_complex',
        'test_frozenset',
    ]


class BuiltinTwoargPowFunctionTests(BuiltinTwoargFunctionTestCase, TranspileTestCase):
    functions = ["pow"]

    not_implemented = [
        'test_bool_bytearray',
        'test_bool_bytes',
        'test_bool_class',
        'test_bool_complex',
        'test_bool_dict',
        'test_bool_float',
        'test_bool_frozenset',
        'test_bool_int',
        'test_bool_list',
        'test_bool_None',
        'test_bool_NotImplemented',
        'test_bool_range',
        'test_bool_set',
        'test_bool_slice',
        'test_bool_str',
        'test_bool_tuple',

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

        'test_bytes_bool',
        'test_bytes_bytearray',
        'test_bytes_bytes',
        'test_bytes_class',
        'test_bytes_complex',
        'test_bytes_dict',
        'test_bytes_float',
        'test_bytes_frozenset',
        'test_bytes_int',
        'test_bytes_list',
        'test_bytes_None',
        'test_bytes_NotImplemented',
        'test_bytes_range',
        'test_bytes_set',
        'test_bytes_slice',
        'test_bytes_str',
        'test_bytes_tuple',

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

        'test_complex_bool',
        'test_complex_bytearray',
        'test_complex_bytes',
        'test_complex_class',
        'test_complex_complex',
        'test_complex_dict',
        'test_complex_float',
        'test_complex_frozenset',
        'test_complex_int',
        'test_complex_list',
        'test_complex_None',
        'test_complex_NotImplemented',
        'test_complex_range',
        'test_complex_set',
        'test_complex_slice',
        'test_complex_str',
        'test_complex_tuple',

        'test_dict_bool',
        'test_dict_bytearray',
        'test_dict_bytes',
        'test_dict_class',
        'test_dict_complex',
        'test_dict_dict',
        'test_dict_float',
        'test_dict_frozenset',
        'test_dict_int',
        'test_dict_list',
        'test_dict_None',
        'test_dict_NotImplemented',
        'test_dict_range',
        'test_dict_set',
        'test_dict_slice',
        'test_dict_str',
        'test_dict_tuple',

        'test_float_bool',
        'test_float_bytearray',
        'test_float_bytes',
        'test_float_class',
        'test_float_complex',
        'test_float_dict',
        'test_float_float',
        'test_float_frozenset',
        'test_float_int',
        'test_float_list',
        'test_float_None',
        'test_float_NotImplemented',
        'test_float_range',
        'test_float_set',
        'test_float_slice',
        'test_float_str',
        'test_float_tuple',

        'test_frozenset_bool',
        'test_frozenset_bytearray',
        'test_frozenset_bytes',
        'test_frozenset_class',
        'test_frozenset_complex',
        'test_frozenset_dict',
        'test_frozenset_float',
        'test_frozenset_frozenset',
        'test_frozenset_int',
        'test_frozenset_list',
        'test_frozenset_None',
        'test_frozenset_NotImplemented',
        'test_frozenset_range',
        'test_frozenset_set',
        'test_frozenset_slice',
        'test_frozenset_str',
        'test_frozenset_tuple',

        'test_int_bytearray',
        'test_int_bytes',
        'test_int_class',
        'test_int_complex',
        'test_int_dict',
        'test_int_float',
        'test_int_frozenset',
        'test_int_int',
        'test_int_list',
        'test_int_None',
        'test_int_NotImplemented',
        'test_int_range',
        'test_int_set',
        'test_int_slice',
        'test_int_str',
        'test_int_tuple',

        'test_list_bool',
        'test_list_bytearray',
        'test_list_bytes',
        'test_list_class',
        'test_list_complex',
        'test_list_dict',
        'test_list_float',
        'test_list_frozenset',
        'test_list_int',
        'test_list_list',
        'test_list_None',
        'test_list_NotImplemented',
        'test_list_range',
        'test_list_set',
        'test_list_slice',
        'test_list_str',
        'test_list_tuple',

        'test_None_bool',
        'test_None_bytearray',
        'test_None_bytes',
        'test_None_class',
        'test_None_complex',
        'test_None_dict',
        'test_None_float',
        'test_None_frozenset',
        'test_None_int',
        'test_None_list',
        'test_None_None',
        'test_None_NotImplemented',
        'test_None_range',
        'test_None_set',
        'test_None_slice',
        'test_None_str',
        'test_None_tuple',

        'test_NotImplemented_bool',
        'test_NotImplemented_bytearray',
        'test_NotImplemented_bytes',
        'test_NotImplemented_class',
        'test_NotImplemented_complex',
        'test_NotImplemented_dict',
        'test_NotImplemented_float',
        'test_NotImplemented_frozenset',
        'test_NotImplemented_int',
        'test_NotImplemented_list',
        'test_NotImplemented_None',
        'test_NotImplemented_NotImplemented',
        'test_NotImplemented_range',
        'test_NotImplemented_set',
        'test_NotImplemented_slice',
        'test_NotImplemented_str',
        'test_NotImplemented_tuple',

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

        'test_set_bool',
        'test_set_bytearray',
        'test_set_bytes',
        'test_set_class',
        'test_set_complex',
        'test_set_dict',
        'test_set_float',
        'test_set_frozenset',
        'test_set_int',
        'test_set_list',
        'test_set_None',
        'test_set_NotImplemented',
        'test_set_range',
        'test_set_set',
        'test_set_slice',
        'test_set_str',
        'test_set_tuple',

        'test_slice_bool',
        'test_slice_bytearray',
        'test_slice_bytes',
        'test_slice_class',
        'test_slice_complex',
        'test_slice_dict',
        'test_slice_float',
        'test_slice_frozenset',
        'test_slice_int',
        'test_slice_list',
        'test_slice_None',
        'test_slice_NotImplemented',
        'test_slice_range',
        'test_slice_set',
        'test_slice_slice',
        'test_slice_str',
        'test_slice_tuple',

        'test_str_bool',
        'test_str_bytearray',
        'test_str_bytes',
        'test_str_class',
        'test_str_complex',
        'test_str_dict',
        'test_str_float',
        'test_str_frozenset',
        'test_str_int',
        'test_str_list',
        'test_str_None',
        'test_str_NotImplemented',
        'test_str_range',
        'test_str_set',
        'test_str_slice',
        'test_str_str',
        'test_str_tuple',

        'test_tuple_bool',
        'test_tuple_bytearray',
        'test_tuple_bytes',
        'test_tuple_class',
        'test_tuple_complex',
        'test_tuple_dict',
        'test_tuple_float',
        'test_tuple_frozenset',
        'test_tuple_int',
        'test_tuple_list',
        'test_tuple_None',
        'test_tuple_NotImplemented',
        'test_tuple_range',
        'test_tuple_set',
        'test_tuple_slice',
        'test_tuple_str',
        'test_tuple_tuple',
    ]
