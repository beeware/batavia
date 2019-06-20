from ..utils import TranspileTestCase, \
    UnaryOperationTestCase, \
    BinaryOperationTestCase, \
    InplaceOperationTestCase, \
    adjust, MagicMethodFunctionTestCase

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
            try:
                x.attr = 42
            except AttributeError as e:
                print(e)
            print('Done.')
            """)

    def test_getattr(self):
        self.assertCodeExecution("""
            x = [1, 2, 3]
            try:
                print(x.attr)
            except AttributeError as e:
                print(e)
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
            try:
                print(x[10])
            except IndexError as e:
                print(e)
            """)

        # Negative index out of range
        self.assertCodeExecution("""
            x = [1, 2, 3, 4, 5]
            try:
                print(x[-10])
            except IndexError as e:
                print(e)
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
            try:
                print(x[::0])
            except ValueError as e:
                print(e)
            print('Done.')
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

        # Slice -1 start with reverse step
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
            try:
                l.insert()
            except TypeError as e:
                print(e)
        """)

        self.assertCodeExecution("""
            l = []
            try:
                l.insert("0", 1)
            except TypeError as e:
                print(e)
            print(l)
        """)

        self.assertCodeExecution("""
            l = []
            try:
                l.insert(1.0, 1)
            except TypeError as e:
                print(e)
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
            try:
                l.remove(1)
            except ValueError as e:
                print(e)
        """)

        self.assertCodeExecution("""
            l = [1]
            try:
                l.remove()
            except TypeError as e:
                print(e)
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
            try:
                l.pop(2)
            except IndexError as e:
                print(e)
        """)

        self.assertCodeExecution("""
            l = []
            try:
                l.pop(1, 2)
            except TypeError as e:
                print(e)
            """)

        self.assertCodeExecution("""
            l = [1]
            try:
                l.pop("0")
            except TypeError as e:
                print(e)
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
            try:
                l.clear("invalid")
            except TypeError as e:
                print(e)
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

    def test_sort(self):
        self.assertCodeExecution("""
        x = [5, 2, 4, 3, 1]
        print(x.sort())
        print([].sort())
        """)

    def test_sort_with_args(self):
        self.assertCodeExecution("""
            def key_func(val):
                return val % 4
            l = [1, 2, 3]
            print([1, 2, 3].sort(reverse=True))  # test retval
            print(l)
            l = [1, 2, 3, 4, 5, 6, -1, 27, 33, 155]
            l.sort(key=key_func)
            print(l)

            l = [1, 2, 3, 4, 5, 6, -1, 27, 33, 155]
            l.sort(key=key_func, reverse=True)
            print(l)

            try:
                print([].sort(1))
            except TypeError as e:
                print(e)

            try:
                print([].sort(a=1))
            except TypeError as e:
                print(e)
            """)

    def test_len(self):
        self.assertCodeExecution("""
            x = []
            print(len(x))
            print(type(len(x)))
            """)

    def test_append(self):
        self.assertCodeExecution("""
            print([2, 3].append(1))

            try:
                print([].append(1, 2))
            except TypeError as e:
                print(e)

            try:
                print([].append(a=1))
            except TypeError as e:
                print(e)
            """)

    def test_extend(self):
        self.assertCodeExecution("""
            def iter():
                yield 0
                yield ''
                yield True

            print([1, 2].extend([3, 4])
            print([].extend(iter()))

            try:
                print([].extend(1))
            except TypeError as e:
                print(e)

            try:
                print([].extend(a=1))
            except TypeError as e:
                print(e)
            """)

    def test_list_is_mutable(self):
        self.assertCodeExecution("""
            a = []
            b = a
            b.append(1)
            print(a)
            print(a != b or a is not b)
            """)

    def test_copy(self):
        "Test the shallow copy and ensure it's mutable."
        self.assertCodeExecution("""
            x = [1]
            y = [x]
            print(y.copy())
            print(y.copy()[0] is x))

            try:
                [].copy(1)
            except TypeError as e:
                print(e)
            """)


class MagicMethodFunctionTests(MagicMethodFunctionTestCase, TranspileTestCase):
    data_type = 'list'
    MagicMethodFunctionTestCase._add_tests(vars(), list)

    is_flakey = [
        "test__iadd__set",  # Set ordering issues.
        "test__iadd__dict",  # Set ordering issues.
    ]

    not_implemented = [
        "test__imul__bytearray",
        "test__imul__bytes",
        "test__imul__class",
        "test__imul__complex",
        "test__imul__dict",
        "test__imul__float",
        "test__imul__frozenset",
        "test__imul__list",
        "test__imul__None",
        "test__imul__NotImplemented",
        "test__imul__range",
        "test__imul__set",
        "test__imul__slice",
        "test__imul__str",
        "test__imul__tuple",
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


class UnaryListOperationTests(UnaryOperationTestCase, TranspileTestCase):
    data_type = 'list'


class BinaryListOperationTests(BinaryOperationTestCase, TranspileTestCase):
    data_type = 'list'


class InplaceListOperationTests(InplaceOperationTestCase, TranspileTestCase):
    data_type = 'list'

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
