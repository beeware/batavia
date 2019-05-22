from ..utils import TranspileTestCase, UnaryOperationTestCase, BinaryOperationTestCase, InplaceOperationTestCase, \
    MagicMethodFunctionTestCase


class BytearrayTests(TranspileTestCase):
    def test_len(self):
        self.assertCodeExecution("""
        print(len(bytearray()))
        print(type(len(bytearray())))
        print(len(bytearray([1, 2])))
        """)


class MagicMethodFunctionTests(MagicMethodFunctionTestCase, TranspileTestCase):
    data_type = 'bytearray'

    not_implemented = [
        "test_imultiply_bool",
        "test_imultiply_bytearray",
        "test_imultiply_bytes",
        "test_imultiply_class",
        "test_imultiply_complex",
        "test_imultiply_dict",
        "test_imultiply_float",
        "test_imultiply_frozenset",
        "test_imultiply_int",
        "test_imultiply_list",
        "test_imultiply_None",
        "test_imultiply_NotImplemented",
        "test_imultiply_range",
        "test_imultiply_set",
        "test_imultiply_slice",
        "test_imultiply_str",
        "test_imultiply_tuple",

        "test_multiply_bool",
        "test_multiply_bytearray",
        "test_multiply_bytes",
        "test_multiply_class",
        "test_multiply_complex",
        "test_multiply_dict",
        "test_multiply_float",
        "test_multiply_frozenset",
        "test_multiply_int",
        "test_multiply_list",
        "test_multiply_None",
        "test_multiply_NotImplemented",
        "test_multiply_range",
        "test_multiply_set",
        "test_multiply_slice",
        "test_multiply_str",
        "test_multiply_tuple",

        "test_rmodulo_bytearray",

        "test_rmultiply_bool",
        "test_rmultiply_bytearray",
        "test_rmultiply_bytes",
        "test_rmultiply_class",
        "test_rmultiply_complex",
        "test_rmultiply_dict",
        "test_rmultiply_float",
        "test_rmultiply_frozenset",
        "test_rmultiply_int",
        "test_rmultiply_list",
        "test_rmultiply_None",
        "test_rmultiply_NotImplemented",
        "test_rmultiply_range",
        "test_rmultiply_set",
        "test_rmultiply_slice",
        "test_rmultiply_str",
        "test_rmultiply_tuple",
    ]

    not_implemented_versions = {
        "test_modulo_bool": ['3.5', '3.6'],
        "test_modulo_bytearray": ['3.5', '3.6'],
        "test_modulo_bytes": ['3.5', '3.6'],
        "test_modulo_class": ['3.5', '3.6'],
        "test_modulo_complex": ['3.5', '3.6'],
        "test_modulo_dict": ['3.5', '3.6'],
        "test_modulo_float": ['3.5', '3.6'],
        "test_modulo_frozenset": ['3.5', '3.6'],
        "test_modulo_int": ['3.5', '3.6'],
        "test_modulo_list": ['3.5', '3.6'],
        "test_modulo_None": ['3.5', '3.6'],
        "test_modulo_NotImplemented": ['3.5', '3.6'],
        "test_modulo_range": ['3.5', '3.6'],
        "test_modulo_set": ['3.5', '3.6'],
        "test_modulo_slice": ['3.5', '3.6'],
        "test_modulo_str": ['3.5', '3.6'],
        "test_modulo_tuple": ['3.5', '3.6'],

        "test_rmodulo_bool": ['3.4'],
        "test_rmodulo_bytearray": ['3.4'],
        "test_rmodulo_bytes": ['3.4'],
        "test_rmodulo_class": ['3.4'],
        "test_rmodulo_complex": ['3.4'],
        "test_rmodulo_dict": ['3.4'],
        "test_rmodulo_float": ['3.4'],
        "test_rmodulo_frozenset": ['3.4'],
        "test_rmodulo_int": ['3.4'],
        "test_rmodulo_list": ['3.4'],
        "test_rmodulo_None": ['3.4'],
        "test_rmodulo_NotImplemented": ['3.4'],
        "test_rmodulo_range": ['3.4'],
        "test_rmodulo_set": ['3.4'],
        "test_rmodulo_slice": ['3.4'],
        "test_rmodulo_str": ['3.4'],
        "test_rmodulo_tuple": ['3.4'],
    }


class UnaryBytearrayOperationTests(UnaryOperationTestCase, TranspileTestCase):
    data_type = 'bytearray'

    not_implemented = [
        'test_unary_invert',
        'test_unary_negative',
        'test_unary_not',
        'test_unary_positive',
    ]


class BinaryBytearrayOperationTests(BinaryOperationTestCase, TranspileTestCase):
    data_type = 'bytearray'

    not_implemented = [
        'test_eq_bytearray',

        'test_ge_bool',
        'test_ge_bytearray',
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

        'test_multiply_bool',
        'test_multiply_int',

        'test_ne_bytearray',

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

    not_implemented_versions = {
        'test_modulo_bool': ['3.5', '3.6'],
        'test_modulo_bytearray': ['3.5', '3.6'],
        'test_modulo_bytes': ['3.5', '3.6'],
        'test_modulo_class': ['3.5', '3.6'],
        'test_modulo_complex': ['3.5', '3.6'],
        'test_modulo_dict': ['3.5', '3.6'],
        'test_modulo_float': ['3.5', '3.6'],
        'test_modulo_frozenset': ['3.5', '3.6'],
        'test_modulo_int': ['3.5', '3.6'],
        'test_modulo_list': ['3.5', '3.6'],
        'test_modulo_None': ['3.5', '3.6'],
        'test_modulo_NotImplemented': ['3.5', '3.6'],
        'test_modulo_range': ['3.5', '3.6'],
        'test_modulo_set': ['3.5', '3.6'],
        'test_modulo_slice': ['3.5', '3.6'],
        'test_modulo_str': ['3.5', '3.6'],
        'test_modulo_tuple': ['3.5', '3.6'],
    }


class InplaceBytearrayOperationTests(InplaceOperationTestCase, TranspileTestCase):
    data_type = 'bytearray'

    not_implemented = [
        'test_multiply_bool',
        'test_multiply_int',
    ]

    not_implemented_versions = {
        'test_modulo_bool': ['3.5', '3.6'],
        'test_modulo_bytearray': ['3.5', '3.6'],
        'test_modulo_bytes': ['3.5', '3.6'],
        'test_modulo_None': ['3.5', '3.6'],
        'test_modulo_NotImplemented': ['3.5', '3.6'],
        'test_modulo_class': ['3.5', '3.6'],
        'test_modulo_complex': ['3.5', '3.6'],
        'test_modulo_dict': ['3.5', '3.6'],
        'test_modulo_float': ['3.5', '3.6'],
        'test_modulo_frozenset': ['3.5', '3.6'],
        'test_modulo_int': ['3.5', '3.6'],
        'test_modulo_list': ['3.5', '3.6'],
        'test_modulo_range': ['3.5', '3.6'],
        'test_modulo_set': ['3.5', '3.6'],
        'test_modulo_slice': ['3.5', '3.6'],
        'test_modulo_str': ['3.5', '3.6'],
        'test_modulo_tuple': ['3.5', '3.6'],
    }
