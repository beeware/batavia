from ..utils import TranspileTestCase, UnaryOperationTestCase, BinaryOperationTestCase, InplaceOperationTestCase, \
    MagicMethodFunctionTestCase


class IntTests(TranspileTestCase):
    def test_setattr(self):
        self.assertCodeExecution("""
            x = 37
            x.attr = 42
            print('Done.')
            """)

    def test_getattr(self):
        self.assertCodeExecution("""
            x = 37
            print(x.attr)
            print('Done.')
            """)

    def test_invalid_literal(self):
        self.assertCodeExecution("""
            int('q', 16)
            """, run_in_function=False)

    def test_addition_promotes_past_32bits(self):
        self.assertCodeExecution("""
            print(0x80000000 + 1)
            """)

    def test_addition_promotes_past_64bits(self):
        self.assertCodeExecution("""
            print(0x7fffffffffffffff + 2)
            """)

    def test_subtraction_promotes_past_32bits(self):
        self.assertCodeExecution("""
            print(-0x7fffffff - 3)
            """)

    def test_subtraction_promotes_past_64bits(self):
        self.assertCodeExecution("""
            print(-0x7fffffffffffffff - 3)
            """)

    def test_multiplication_promotes(self):
        self.assertCodeExecution("""
            print(2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2*2+1)
            """)

    def test_pow_promotes(self):
        self.assertCodeExecution("""
            print((2**1024)+1)
            """)

    def test_comparisons_behave(self):
        self.assertCodeExecution("""
            print(((1 == 2) * -1) & ((1 == 2) * -1))
        """)


class MagicMethodFunctionTests(MagicMethodFunctionTestCase, TranspileTestCase):
    data_type = 'int'
    MagicMethodFunctionTestCase._add_tests(vars(), int)

    not_implemented = [
        "test__floordiv__float",
        "test__mod__float",
        "test__mul__bytearray",
        "test__mul__bytes",
        "test__mul__list",
        "test__mul__str",
        "test__mul__tuple",
        "test__pow__complex",
        "test__pow__float",
        "test__sub__float",
        "test__truediv__complex",
        "test__truediv__float",

        "test__rfloordiv__bool",
        "test__rfloordiv__int",
        "test__rlshift__bool",
        "test__rlshift__int",
        "test__rmod__bool",
        "test__rmod__int",
        "test__rmul__bytearray",
        "test__rmul__bytes",
        "test__rmul__list",
        "test__rmul__str",
        "test__rmul__tuple",
        "test__rpow__bool",
        "test__rpow__int",
        "test__rrshift__bool",
        "test__rrshift__int",
        "test__rsub__bool",
        "test__rsub__int",
        "test__rtruediv__bool",
        "test__rtruediv__int",
    ]


class UnaryIntOperationTests(UnaryOperationTestCase, TranspileTestCase):
    data_type = 'int'


class BinaryIntOperationTests(BinaryOperationTestCase, TranspileTestCase):
    data_type = 'int'

    not_implemented = [

        'test_power_float',

        'test_subtract_complex',

        'test_true_divide_complex',
    ]


class InplaceIntOperationTests(InplaceOperationTestCase, TranspileTestCase):
    data_type = 'int'

    not_implemented = [

        'test_power_float',

        'test_subtract_complex',

        'test_true_divide_complex',
    ]
