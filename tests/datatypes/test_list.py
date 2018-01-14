from .. utils import TranspileTestCase,\
    UnaryOperationTestCase,\
    BinaryOperationTestCase,\
    InplaceOperationTestCase,\
    adjust

import unittest
import itertools


def string_permutations(test_list, list_to_permutate):
    """Takes a list and a set,  and returns a list of all the permutations as strings"""
    str_perms = [list(permutation) for permutation in itertools.permutations(list_to_permutate)]
    return [str(test_list + str_perm) for str_perm in str_perms]


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

    def test_index(self):
        self.assertCodeExecution("""
            x = [1, 2, 2, 3]
            print(x.index(1))
            print(x.index(2))
            print(x.index(3))
            print(x.index(2, 1))
            try:
                x.index(3)
            except ValueError as e:
                print(e)
            try:
                x.index(2, 2, 3)
            except ValueError as e:
                print(e)
            try:
                x.index(2, 0, -1)
            except ValueError as e:
                print(e)
            try:
                x.index(2, -4, 4)
            except ValueError as e:
                print(e)
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
        self.assertOrdering([], [1, 2, 3])

        # `other` (right list) is empty
        self.assertOrdering([1, 2, 3], [])

        # both lists are empty
        self.assertOrdering([], [])

        # `this` (left list) is shorter
        self.assertOrdering([1, 2], [1, 2, 3])

        # `other` (right list) is shorter
        self.assertOrdering([1, 2, 3], [1, 2])

        # comparable items aren't equal
        self.assertOrdering([1, 2], [1, 3])

        self.assertOrdering([1, 3], [1, 2])

        # all items are equal
        self.assertOrdering([1, 2, 3], [1, 2, 3])

    def test_insert_success(self):

        # insert at front
        self.assertCodeExecution("""
            l = []
            l.insert(0, "elem")
            print(l)
        """)

        self.assertCodeExecution("""
            l = [2, 3, 4]
            l.insert(0, 1)
            print(l)
        """)

        # insert with positive index
        self.assertCodeExecution("""
            l = [0, 1, 3, 4]
            l.insert(2, 2)
            print(l)
        """)

        self.assertCodeExecution("""
            l = []
            l.insert(10, "elem")
            print(l)
        """)

        # index "out of bounds"
        self.assertCodeExecution("""
            l = ["first", "second"]
            l.insert(5, "last")
            print(l)
        """)

        # insert with negative index
        self.assertCodeExecution("""
            l = []
            l.insert(-1, 0)
            print(l)
        """)

        self.assertCodeExecution("""
            l = [1, 2, 3, 4]
            l.insert(-2, 0)
            print(l)
        """)

    def test_insert_fail(self):

        self.assertCodeExecution("""
            l = []
            l.insert()
        """)

        self.assertCodeExecution("""
            l = []
            l.insert("0", 1)
            print(l)
        """)

        self.assertCodeExecution("""
            l = []
            l.insert(1.0, 1)
        """)

    @unittest.expectedFailure
    def test_insert_subclass_index(self):

        self.assertCodeExecution("""
            class F(float): pass
            l = [1, 2]
            l.insert(F(), 0)
        """)

        self.assertCodeExecution("""
            class I(int): pass
            l = [1, 2]
            l.insert(I(), 0)
        """)

    def test_remove_success(self):

        self.assertCodeExecution("""
            l = [1, 2, "2", 3, "2"]
            l.remove("2")
            print(l)
        """)

    def test_remove_fail(self):

        self.assertCodeExecution("""
            l = []
            l.remove(1)
        """)

        self.assertCodeExecution("""
            l = [1]
            l.remove()
        """)

    def test_pop_success(self):

        self.assertCodeExecution("""
            l = [1, 2, 3]
            print(l.pop(), l)
        """)

        self.assertCodeExecution("""
            l = [5, 6, 7, 8]
            print(l.pop(1), l)
        """)

        self.assertCodeExecution("""
            l = [9, 10, 11, 12]
            print(l.pop(-2), l)
        """)

    def test_pop_fail(self):

        self.assertCodeExecution("""
            l = [1, 2]
            l.pop(2)
        """)

        self.assertCodeExecution("""
            l = []
            l.pop(1, 2)
        """)

        self.assertCodeExecution("""
            l = [1]
            l.pop("0")
        """)

    @unittest.expectedFailure
    def test_pop_subclass_index(self):

        self.assertCodeExecution("""
            class F(float): pass
            l = [1, 2]
            l.pop(F())
        """)

        self.assertCodeExecution("""
            class I(int): pass
            l = [1, 2]
            l.pop(I())
        """)

    def test_clear_success(self):

        self.assertCodeExecution("""
            l = ["one", "two", 3]
            l.clear()
            print(l)
        """)

    def test_clear_args(self):

        self.assertCodeExecution("""
            l = ["one", "two", 3]
            l.clear("invalid")
            print(l)
        """)

    def test_clear_empty_list(self):

        self.assertCodeExecution("""
            l = []
            l.clear()
            print(l)
        """)

    def test_count(self):
        self.assertCodeExecution("""
        x = [1, 2, 2, 3]
        print(x.count(2))
        print(x.count(3))
        print(x.count(4))
        """)

        # count on empty list
        self.assertCodeExecution("""
        x = []
        print(x.count(1))
        """)

        # TypeError on too many or too few args
        self.assertCodeExecution("""
        x = [1, 2]
        try:
            x.count(3, 4)
        except TypeError as e:
            print(e)
        try:
            x.count()
        except TypeError as e:
            print(e)
        """)

    def test_reverse(self):
        self.assertCodeExecution("""
        x = []
        x.reverse()
        print(x)
        """)

        self.assertCodeExecution("""
        x = [1]
        x.reverse()
        print(x)
        """)

        self.assertCodeExecution("""
        x = [0, 0]
        x.reverse()
        print(x)
        """)

        self.assertCodeExecution("""
        x = [1, 2]
        x.reverse()
        print(x)
        """)

        self.assertCodeExecution("""
        x = [1, 2, 3]
        try:
            x.reverse(0)
        except TypeError as e:
            print(e)
        """)

    def test_len(self):
        self.assertCodeExecution("""
        x = []
        print(len(x))
        print(type(len(x)))
        """)


class UnaryListOperationTests(UnaryOperationTestCase, TranspileTestCase):
    data_type = 'list'

    not_implemented = [
    ]


class BinaryListOperationTests(BinaryOperationTestCase, TranspileTestCase):
    data_type = 'list'


class InplaceListOperationTests(InplaceOperationTestCase, TranspileTestCase):
    data_type = 'list'

    not_implemented = [
    ]

    test_sets = [
        {1, 2.3456, 'another'},
        {'a', 'c', 'd'},
        {'a', 'b'},
    ]
    test_lists = [
        [],
        [1],
        [3, 4, 5],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        ['a', 'b', 'c'],
        [[1, 2], [3, 4]]
    ]

    substitutions = {}

    for test_list in test_lists:
        for test_set in test_sets:
            substitutions[str((test_list) + list(test_set))] = string_permutations(test_list, test_set)
