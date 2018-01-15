from .. utils import TranspileTestCase, UnaryOperationTestCase, BinaryOperationTestCase, InplaceOperationTestCase

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


class UnaryTupleOperationTests(UnaryOperationTestCase, TranspileTestCase):
    data_type = 'tuple'


class BinaryTupleOperationTests(BinaryOperationTestCase, TranspileTestCase):
    data_type = 'tuple'


class InplaceTupleOperationTests(InplaceOperationTestCase, TranspileTestCase):
    data_type = 'tuple'
