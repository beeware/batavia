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
    MagicMethodFunctionTestCase._add_tests(vars(), bytearray)

    not_implemented = [
        "test__imul__bool",
        "test__imul__bytearray",
        "test__imul__bytes",
        "test__imul__class",
        "test__imul__complex",
        "test__imul__dict",
        "test__imul__float",
        "test__imul__frozenset",
        "test__imul__int",
        "test__imul__list",
        "test__imul__None",
        "test__imul__NotImplemented",
        "test__imul__range",
        "test__imul__set",
        "test__imul__slice",
        "test__imul__str",
        "test__imul__tuple",

        "test__mul__bool",
        "test__mul__bytearray",
        "test__mul__bytes",
        "test__mul__class",
        "test__mul__complex",
        "test__mul__dict",
        "test__mul__float",
        "test__mul__frozenset",
        "test__mul__int",
        "test__mul__list",
        "test__mul__None",
        "test__mul__NotImplemented",
        "test__mul__range",
        "test__mul__set",
        "test__mul__slice",
        "test__mul__str",
        "test__mul__tuple",

        "test__rmul__bool",
        "test__rmul__bytearray",
        "test__rmul__bytes",
        "test__rmul__class",
        "test__rmul__complex",
        "test__rmul__dict",
        "test__rmul__float",
        "test__rmul__frozenset",
        "test__rmul__int",
        "test__rmul__list",
        "test__rmul__None",
        "test__rmul__NotImplemented",
        "test__rmul__range",
        "test__rmul__set",
        "test__rmul__slice",
        "test__rmul__str",
        "test__rmul__tuple",
    ]

    not_implemented_versions = {
        "test__mod__bool": ['3.5', '3.6'],
        "test__mod__bytearray": ['3.5', '3.6'],
        "test__mod__bytes": ['3.5', '3.6'],
        "test__mod__class": ['3.5', '3.6'],
        "test__mod__complex": ['3.5', '3.6'],
        "test__mod__dict": ['3.5', '3.6'],
        "test__mod__float": ['3.5', '3.6'],
        "test__mod__frozenset": ['3.5', '3.6'],
        "test__mod__int": ['3.5', '3.6'],
        "test__mod__list": ['3.5', '3.6'],
        "test__mod__None": ['3.5', '3.6'],
        "test__mod__NotImplemented": ['3.5', '3.6'],
        "test__mod__range": ['3.5', '3.6'],
        "test__mod__set": ['3.5', '3.6'],
        "test__mod__slice": ['3.5', '3.6'],
        "test__mod__str": ['3.5', '3.6'],
        "test__mod__tuple": ['3.5', '3.6'],

        "test__rmod__bytearray": ['3.5', '3.6'],

        "test__rmod__missing": ['3.4'],
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

        'test_matmul_bool',
        'test_matmul_int',

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
        'test_matmul_bool',
        'test_matmul_int',
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
