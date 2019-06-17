import unittest
from ..utils import TranspileTestCase, UnaryOperationTestCase, BinaryOperationTestCase, InplaceOperationTestCase, \
    MagicMethodFunctionTestCase, transforms, adjust
from itertools import product


class BoolTests(TranspileTestCase):

    @transforms(
        decimal=False,
        float_exp=False,
        high_precision_float=False,
        js_bool=False,
        complex_num=False)
    def test_conversion_types(self, js_cleaner, py_cleaner):
        """
        test all conversion types and their alternate forms
        """
        alternate = ('#', '')
        types = ('b', 'd', 'e', 'E', 'f', 'F', 'g', 'G', 'n', 'o', 's', 'x', 'X', '%')
        args = (True, False)
        combinations = product(alternate, types, args)
        test_str = ''.join(
            [
                adjust(
                    """
                    try:
                        print(">>> format({arg}, '{alter}{typ}')")
                        print(format({arg}, '{alter}{typ}'))
                    except ValueError as err:
                        print(err)
                    except OverflowError as err:
                        print(err)
                    """.format(alter=alter, typ=typ, arg=arg)
                ) for alter, typ, arg in combinations
            ]
        )
        self.assertCodeExecution(test_str, js_cleaner=js_cleaner, py_cleaner=py_cleaner)

    @unittest.expectedFailure
    @transforms(
        decimal=False,
        float_exp=False,
        high_precision_float=False,
        js_bool=False,
        complex_num=False)
    def test_character_conversion_type(self, js_cleaner, py_cleaner):
        self.assertCodeExecution("""
            print(format(True, 'c'))
            print(format(False, 'c'))
            """, js_cleaner=js_cleaner, py_cleaner=py_cleaner)

    @transforms(
        js_bool=False,
        decimal=False,
        float_exp=False,
        memory_ref=False
    )
    def test_simple_format(self, js_cleaner, py_cleaner):
        self.assertCodeExecution("""
            print(format(True, ''))
            """, js_cleaner=js_cleaner, py_cleaner=py_cleaner)

    @transforms(
        js_bool=False,
        decimal=False,
        float_exp=False,
        memory_ref=False
    )
    def test_format__redirects_to_parent_types(self, js_cleaner, py_cleaner):
        self.assertCodeExecution("""
            print('>>> format(True, "-09.3f")')
            print(format(True, "-09.3f"))
            print('>>> format(False, "-5,x")')
            print(format(False, " >-5x"))
            """, js_cleaner=js_cleaner, py_cleaner=py_cleaner)

    def test_bool_rejects_invalid_format(self):
        self.assertCodeExecution("""
            x = True
            try:
                format(x, 'm')
            except ValueError as e:
                print(e)
            try:
                print(format(x, '3&^0m'))
            except ValueError as e:
                print(e)
            print('Done.')
            """)

    def test_setattr(self):
        self.assertCodeExecution("""
            x = True
            try:
                x.attr = 42
            except AttributeError as e:
                print(e)
            print('Done.')
            """)

    def test_getattr(self):
        self.assertCodeExecution("""
            x = True
            try:
                print(x.attr)
            except AttributeError as e:
                print(e)
            print('Done.')
            """)


class MagicMethodFunctionTests(MagicMethodFunctionTestCase, TranspileTestCase):
    data_type = 'bool'
    MagicMethodFunctionTestCase._add_tests(vars(), bool)

    not_implemented = [
        # All these should be returning NotImplemented and delegating to the __rxxx__ versions
        # of the other types.
        "test__add__complex",
        "test__add__float",
        "test__floordiv__float",
        "test__mod__float",
        "test__mul__bytearray",
        "test__mul__bytes",
        "test__mul__complex",
        "test__mul__float",
        "test__mul__list",
        "test__mul__str",
        "test__mul__tuple",
        "test__pow__complex",
        "test__pow__float",
        "test__sub__complex",
        "test__sub__float",
        "test__truediv__complex",
        "test__truediv__float",

        "test__radd__complex",
        "test__radd__float",
        "test__rfloordiv__bool",
        "test__rfloordiv__float",
        "test__rfloordiv__int",
        "test__rmod__bool",
        "test__rmod__float",
        "test__rmod__int",
        "test__rmul__bytearray",
        "test__rmul__bytes",
        "test__rmul__complex",
        "test__rmul__float",
        "test__rmul__list",
        "test__rmul__str",
        "test__rmul__tuple",
        "test__rpow__bool",
        "test__rpow__complex",
        "test__rpow__float",
        "test__rpow__int",
        "test__rlshift__bool",
        "test__rlshift__int",
        "test__rrshift__bool",
        "test__rrshift__int",
        "test__rsub__bool",
        "test__rsub__complex",
        "test__rsub__float",
        "test__rsub__int",
        "test__rtruediv__bool",
        "test__rtruediv__complex",
        "test__rtruediv__float",
        "test__rtruediv__int",
    ]


class UnaryBoolOperationTests(UnaryOperationTestCase, TranspileTestCase):
    data_type = 'bool'


class BinaryBoolOperationTests(BinaryOperationTestCase, TranspileTestCase):
    data_type = 'bool'


class InplaceBoolOperationTests(InplaceOperationTestCase, TranspileTestCase):
    data_type = 'bool'
