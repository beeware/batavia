from ..utils import TranspileTestCase, UnaryOperationTestCase, BinaryOperationTestCase, InplaceOperationTestCase, \
    MagicMethodFunctionTestCase

import unittest


class TupleTests(TranspileTestCase):
    @unittest.expectedFailure
    def test_setattr(self):
        self.assertCodeExecution("""
            x = (1, 2, 3)
            x.attr = 42
            print('Done.')
            """)

    def test_getattr(self):
        self.assertCodeExecution("""
            x = (1, 2, 3)
            print(x.attr)
            print('Done.')
            """)

    def test_creation(self):
        self.assertCodeExecution("""
            a = 1
            b = 2
            c = 3
            d = 4
            e = 5
            x = (a, b, c, d, e)
            print(x)
            """)

    def test_const_creation(self):
        self.assertCodeExecution("""
            x = (1, 2, 3, 4, 5)
            print(x)
            """)

    def test_const_creation_multitype(self):
        self.assertCodeExecution("""
            x = (1, 2.5, "3", True, 5)
            print(x)
            """)

    def test_getitem(self):
        # Simple positive index
        self.assertCodeExecution("""
            x = (1, 2, 3, 4, 5)
            print(x[2])
            """)

        # Simple negative index
        self.assertCodeExecution("""
            x = (1, 2, 3, 4, 5)
            print(x[-2])
            """)

        # Positive index out of range
        self.assertCodeExecution("""
            x = (1, 2, 3, 4, 5)
            print(x[10])
            """)

        # Negative index out of range
        self.assertCodeExecution("""
            x = (1, 2, 3, 4, 5)
            print(x[-10])
            """)

    def test_count(self):
        self.assertCodeExecution("""
        x = (1, 2, 2, 3)
        print(x.count(2))
        print(x.count(3))
        print(x.count(4))
        """)

        # count on empty tuple
        self.assertCodeExecution("""
        x = ()
        print(x.count(1))
        """)

        # TypeError on too many or too few args
        self.assertCodeExecution("""
        x = (1, 2)
        try:
            x.count(3, 4)
        except TypeError as e:
            print(e)
        try:
            x.count()
        except TypeError as e:
            print(e)
        """)

    def test_index(self):
        self.assertCodeExecution("""
        x = (1, 2, 2, 3)
        print(x.index(1))
        print(x.index(2))
        print(x.index(3))
        print(x.index(2, 2))
        try:
            x.index(4)
        except ValueError as e:
            print(e)
        try:
            x.index(2, 0, 1)
        except ValueError as e:
            print(e)
        try:
            x.index(2, 2, 1)
        except ValueError as e:
            print(e)
        try:
            x.index()
        except TypeError as e:
            print(e)
        try:
            x.index(3, 4, 5, 6)
        except TypeError as e:
            print(e)
        """)

    def test_slice(self):
        # Full slice
        self.assertCodeExecution("""
            x = (1, 2, 3, 4, 5)
            print(x[:])
            """)

        # Left bound slice
        self.assertCodeExecution("""
            x = (1, 2, 3, 4, 5)
            print(x[1:])
            """)

        # Right bound slice
        self.assertCodeExecution("""
            x = (1, 2, 3, 4, 5)
            print(x[:4])
            """)

        # Slice bound in both directions
        self.assertCodeExecution("""
            x = (1, 2, 3, 4, 5)
            print(x[1:4])
            """)

        # Slice with step 0 (error)
        self.assertCodeExecution("""
            x = (1, 2, 3, 4, 5)
            print(x[::0])
            """)

        # Slice with revese step
        self.assertCodeExecution("""
            x = (1, 2, 3, 4, 5)
            print(x[::-1])
            """)

        # Slice -1 stop with reverse step
        self.assertCodeExecution("""
            x = (1, 2, 3, 4, 5)
            print(x[-5:-1:-1])
            """)

        # Slice -1 start with revese step
        self.assertCodeExecution("""
            x = (1, 2, 3, 4, 5)
            print(x[-1:0:-1])
            """)

    def test_len(self):
        self.assertCodeExecution("""
        print(len(tuple()))
        print(type(len(tuple())))
        print(len((1,2,3)))
        """)


class MagicMethodFunctionTests(MagicMethodFunctionTestCase, TranspileTestCase):
    data_type = 'tuple'
    MagicMethodFunctionTestCase._add_tests(vars(), tuple)

    not_implemented = [
        "test__mul__bytearray",
        "test__mul__bytes",
        "test__mul__class",
        "test__mul__complex",
        "test__mul__dict",
        "test__mul__float",
        "test__mul__frozenset",
        "test__mul__list",
        "test__mul__None",
        "test__mul__NotImplemented",
        "test__mul__range",
        "test__mul__set",
        "test__mul__slice",
        "test__mul__str",
        "test__mul__tuple",
        "test__rmul__bytearray",
        "test__rmul__bytes",
        "test__rmul__class",
        "test__rmul__complex",
        "test__rmul__dict",
        "test__rmul__float",
        "test__rmul__frozenset",
        "test__rmul__list",
        "test__rmul__None",
        "test__rmul__NotImplemented",
        "test__rmul__range",
        "test__rmul__set",
        "test__rmul__slice",
        "test__rmul__str",
        "test__rmul__tuple",
    ]


class UnaryTupleOperationTests(UnaryOperationTestCase, TranspileTestCase):
    data_type = 'tuple'


class BinaryTupleOperationTests(BinaryOperationTestCase, TranspileTestCase):
    data_type = 'tuple'


class InplaceTupleOperationTests(InplaceOperationTestCase, TranspileTestCase):
    data_type = 'tuple'
