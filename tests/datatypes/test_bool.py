from ..utils import TranspileTestCase, UnaryOperationTestCase, BinaryOperationTestCase, InplaceOperationTestCase, \
    MagicMethodFunctionTestCase


class BoolTests(TranspileTestCase):
    def test_setattr(self):
        self.assertCodeExecution("""
            x = True
            x.attr = 42
            print('Done.')
            """)

    def test_getattr(self):
        self.assertCodeExecution("""
            x = True
            print(x.attr)
            print('Done.')
            """)


class MagicMethodFunctionTests(MagicMethodFunctionTestCase, TranspileTestCase):
    data_type = 'bool'

    not_implemented = [
        # All these should be returning NotImplemented and delegating to the __rxxx__ versions
        # of the other types.
        "test_add_complex",
        "test_add_float",
        "test_floor_divide_float",
        "test_modulo_float",
        "test_multiply_bytearray",
        "test_multiply_bytes",
        "test_multiply_complex",
        "test_multiply_float",
        "test_multiply_list",
        "test_multiply_str",
        "test_multiply_tuple",
        "test_power_complex",
        "test_power_float",
        "test_subtract_complex",
        "test_subtract_float",
        "test_true_divide_complex",
        "test_true_divide_float",

        "test_radd_complex",
        "test_radd_float",
        "test_rfloor_divide_bool",
        "test_rfloor_divide_float",
        "test_rfloor_divide_int",
        "test_rlshift_bool",
        "test_rlshift_int",
        "test_rmodulo_bool",
        "test_rmodulo_float",
        "test_rmodulo_int",
        "test_rmultiply_bytearray",
        "test_rmultiply_bytes",
        "test_rmultiply_complex",
        "test_rmultiply_float",
        "test_rmultiply_list",
        "test_rmultiply_str",
        "test_rmultiply_tuple",
        "test_rpower_bool",
        "test_rpower_complex",
        "test_rpower_float",
        "test_rpower_int",
        "test_rrshift_bool",
        "test_rrshift_int",
        "test_rsubtract_bool",
        "test_rsubtract_complex",
        "test_rsubtract_float",
        "test_rsubtract_int",
        "test_rtrue_divide_bool",
        "test_rtrue_divide_complex",
        "test_rtrue_divide_float",
        "test_rtrue_divide_int",
    ]


class UnaryBoolOperationTests(UnaryOperationTestCase, TranspileTestCase):
    data_type = 'bool'


class BinaryBoolOperationTests(BinaryOperationTestCase, TranspileTestCase):
    data_type = 'bool'


class InplaceBoolOperationTests(InplaceOperationTestCase, TranspileTestCase):
    data_type = 'bool'
