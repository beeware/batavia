from .. utils import TranspileTestCase, UnaryOperationTestCase, BinaryOperationTestCase, InplaceOperationTestCase, adjust

import unittest


class ListTests(TranspileTestCase):

    def assertOrdering(self, col1, col2):
        """
        runs assertCodeExecution with col1 [<, <=, >, >=] col2
        :param col1: array like
        :param col2: array like
        """

        set_up = adjust("""
            print('>>> x = {col1}')
            print('>>> y = {col2}')
        """.format(col1=col1, col2=col2))

        operators = ['>', '>=', '<', '<=']

        comparisons = [
        adjust("""
            print('>>> x {o} y')
            print({col1} {o} {col2})
        """).format(col1=col1, o=o, col2=col2)
            for o in operators
        ]

        self.assertCodeExecution(set_up + ''.join(comparisons))

    @unittest.expectedFailure
    def test_setattr(self):
        self.assertCodeExecution("""
            x = [1, 2, 3]
            x.attr = 42
            print('Done.')
            """)

    @unittest.expectedFailure
    def test_getattr(self):
        self.assertCodeExecution("""
            x = [1, 2, 3]
            print(x.attr)
            print('Done.')
            """)

    def test_creation(self):
        # Empty list
        self.assertCodeExecution("""
            x = []
            print(x)
            """)

        self.assertCodeExecution("""
            x = [1, 2, 3, 4, 5]
            print(x)
            """)

    def test_type_constructor(self):
        self.assertCodeExecution("""
            x = list()
            print(x)
            """)

        self.assertCodeExecution("""
            x = list([1, 2, 3, 4, 5])
            print(x)
            """)

        self.assertCodeExecution("""
            x = list((1, 2, 3, 4, 5))
            print(x)
            """)

        self.assertCodeExecution("""
            class ListLike:
                def __init__(self, limit):
                    self.i = 0
                    self.limit = limit
                def __iter__(self):
                    return self
                def __next__(self):
                    self.i += 1
                    if self.i > self.limit:
                        raise StopIteration()
                    return self.i
            x = list(ListLike(5))
            print(x)
            """)

    def test_getitem(self):
        # Simple positive index
        self.assertCodeExecution("""
            x = [1, 2, 3, 4, 5]
            print(x[2])
            """)

        # Simple negative index
        self.assertCodeExecution("""
            x = [1, 2, 3, 4, 5]
            print(x[-2])
            """)

        # Positive index out of range
        self.assertCodeExecution("""
            x = [1, 2, 3, 4, 5]
            print(x[10])
            """)

        # Negative index out of range
        self.assertCodeExecution("""
            x = [1, 2, 3, 4, 5]
            print(x[-10])
            """)

    def test_slice(self):
        # Full slice
        self.assertCodeExecution("""
            x = [1, 2, 3, 4, 5]
            print(x[:])
            """)

        # Left bound slice
        self.assertCodeExecution("""
            x = [1, 2, 3, 4, 5]
            print(x[1:])
            """)

        # Right bound slice
        self.assertCodeExecution("""
            x = [1, 2, 3, 4, 5]
            print(x[:4])
            """)

        # Slice bound in both directions
        self.assertCodeExecution("""
            x = [1, 2, 3, 4, 5]
            print(x[1:4])
            """)

        # Slice with step 0 (error)
        self.assertCodeExecution("""
            x = [1, 2, 3, 4, 5]
            print(x[::0])
            """)

        # Slice with revese step
        self.assertCodeExecution("""
            x = [1, 2, 3, 4, 5]
            print(x[::-1])
            """)

        # Slice -1 stop with reverse step
        self.assertCodeExecution("""
            x = [1, 2, 3, 4, 5]
            print(x[-5:-1:-1])
            """)

        # Slice -1 start with revese step
        self.assertCodeExecution("""
            x = [1, 2, 3, 4, 5]
            print(x[-1:0:-1])
            """)

    def test_list_list_comparisons(self):

        # `this` (left list) is empty.
        self.assertOrdering([], [1,2,3])

        # `other` (right list) is empty
        self.assertOrdering([1,2,3], [])

        # both lists are empty
        self.assertOrdering([],[])

        # `this` (left list) is shorter
        self.assertOrdering([1,2], [1,2,3])

        # `other` (right list) is shorter
        self.assertOrdering([1,2,3], [1,2])

        # comparable items aren't equal
        self.assertOrdering([1,2], [1,3])

        self.assertOrdering([1,3], [1,2])

        # all items are equal
        self.assertOrdering([1,2,3], [1,2,3])

class UnaryListOperationTests(UnaryOperationTestCase, TranspileTestCase):
    data_type = 'list'

    not_implemented = [
    ]


class BinaryListOperationTests(BinaryOperationTestCase, TranspileTestCase):
    data_type = 'list'

    not_implemented = [
        'test_floor_divide_complex',

        'test_modulo_complex',

        'test_ne_list',

        'test_subscr_bool',
    ]


class InplaceListOperationTests(InplaceOperationTestCase, TranspileTestCase):
    data_type = 'list'

    not_implemented = [

        'test_add_bytearray',
        'test_add_bytes',
        'test_add_dict',
        'test_add_frozenset',
        'test_add_range',
        'test_add_set',

        'test_floor_divide_complex',

        'test_modulo_complex',
    ]