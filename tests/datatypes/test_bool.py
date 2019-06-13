import unittest
from ..utils import TranspileTestCase, UnaryOperationTestCase, BinaryOperationTestCase, InplaceOperationTestCase, \
    MagicMethodFunctionTestCase, transforms


class BoolTests(TranspileTestCase):

    @transforms(
        js_bool=False,
        decimal=False,
        float_exp=False,
        memory_ref=False
    )
    def test_set_format(self, js_cleaner, py_cleaner):
        self.assertCodeExecution("""
            print(format(True, ''))
            print(format(True, 'b'))
            print(format(False, 'd'))
            print(format(True, 'g'))
            print(format(False, 'G'))
            print(format(True, 'n'))
            print(format(True, 'o'))
            print(format(True, 'x'))
            print(format(True, 'X'))
            print(format(True, '%'))
            print(format(True, 'e'))
            print(format(False, 'e'))
            print(format(True, 'E'))
            print(format(False, 'E'))
            print(format(False, 'f'))
            print(format(False, 'F'))
            # print(format(True, '$^8'))
            # print(format(True, '#>5'))
            """, js_cleaner=js_cleaner, py_cleaner=py_cleaner)
    
    @unittest.expectedFailure
    @transforms(
        js_bool=False,
        decimal=False,
        float_exp=False,
        memory_ref=False
    )
    def test_format__redirects_to_parent_types(self, js_cleaner, py_cleaner):
        self.assertCodeExecution("""
            x = True
            print(format(123.4567, "^-09.3f"))
            """, js_cleaner=js_cleaner, py_cleaner=py_cleaner)

    def test_bool_rejects_invalid_format(self):
        self.assertCodeExecution("""
            x = True
            try:
                format(x, 'm')
            except ValueError as e:
                print(e)
            try:
                format(x, '3^0xx')
            except ValueError as e:
                print(e)
            print('Done.')
            """)

#     def test_setattr(self):
#         self.assertCodeExecution("""
#             x = True
#             try:
#                 x.attr = 42
#             except AttributeError as e:
#                 print(e)
#             print('Done.')
#             """)

#     def test_getattr(self):
#         self.assertCodeExecution("""
#             x = True
#             try:
#                 print(x.attr)
#             except AttributeError as e:
#                 print(e)
#             print('Done.')
#             """)


# class MagicMethodFunctionTests(MagicMethodFunctionTestCase, TranspileTestCase):
#     data_type = 'bool'
#     MagicMethodFunctionTestCase._add_tests(vars(), bool)

#     not_implemented = [
#         # All these should be returning NotImplemented and delegating to the __rxxx__ versions
#         # of the other types.
#         "test__add__complex",
#         "test__add__float",
#         "test__floordiv__float",
#         "test__mod__float",
#         "test__mul__bytearray",
#         "test__mul__bytes",
#         "test__mul__complex",
#         "test__mul__float",
#         "test__mul__list",
#         "test__mul__str",
#         "test__mul__tuple",
#         "test__pow__complex",
#         "test__pow__float",
#         "test__sub__complex",
#         "test__sub__float",
#         "test__truediv__complex",
#         "test__truediv__float",

#         "test__radd__complex",
#         "test__radd__float",
#         "test__rfloordiv__bool",
#         "test__rfloordiv__float",
#         "test__rfloordiv__int",
#         "test__rmod__bool",
#         "test__rmod__float",
#         "test__rmod__int",
#         "test__rmul__bytearray",
#         "test__rmul__bytes",
#         "test__rmul__complex",
#         "test__rmul__float",
#         "test__rmul__list",
#         "test__rmul__str",
#         "test__rmul__tuple",
#         "test__rpow__bool",
#         "test__rpow__complex",
#         "test__rpow__float",
#         "test__rpow__int",
#         "test__rlshift__bool",
#         "test__rlshift__int",
#         "test__rrshift__bool",
#         "test__rrshift__int",
#         "test__rsub__bool",
#         "test__rsub__complex",
#         "test__rsub__float",
#         "test__rsub__int",
#         "test__rtruediv__bool",
#         "test__rtruediv__complex",
#         "test__rtruediv__float",
#         "test__rtruediv__int",
#     ]


# class UnaryBoolOperationTests(UnaryOperationTestCase, TranspileTestCase):
#     data_type = 'bool'


# class BinaryBoolOperationTests(BinaryOperationTestCase, TranspileTestCase):
#     data_type = 'bool'


# class InplaceBoolOperationTests(InplaceOperationTestCase, TranspileTestCase):
#     data_type = 'bool'
