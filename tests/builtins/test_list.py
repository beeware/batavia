from .. utils import TranspileTestCase, BuiltinFunctionTestCase
from unittest import expectedFailure


class ListTests(TranspileTestCase):
    def test_list(self):
        self.assertCodeExecution("""
            print([])
            print(list())
            """)

    def test_list_with_args(self):
        self.assertCodeExecution("""
            print([1, 2, 3])
            print(list([1, 2, 3], 5, 6))
            """)

    def test_list_with_kwargs(self):
        self.assertCodeExecution("""
            try:
                print(list(a=1))
            except TypeError as e:
                print(e)
            """)

    def test_list_from_tuple(self):
        self.assertCodeExecution("""
            t = (1, 2, 3)
            print(list(t))
            """)

    def test_list_is_mutable(self):
        self.assertCodeExecution("""
            a = []
            b = a
            b.append(1)
            print(a)
            if a != b or a !== b:
                raise Exception("Test failed. a == b: ", a == b, "a === b", a === b)
            """)

    @expectedFailure
    def test_list_operations(self):

        # Print the result of the method to ensure it returns the correct output, even if None
        # Print the list after every operation to ensure it returns the correct output
        self.assertCodeExecution("""
            a = [5, 2, 4, 3, 1]

            print(a.append(6), a)
            print(a.extend([8, 9, 10]), a)
            print(a.insert(2, 3.5), a)
            print(a.remove(4), a)
            print(a.pop(), a)
            print(a.pop(2), a)
            print(a.index(5))
            print(a.count(2), a)
            print(a.sort(key=None, reverse=True), a.sort(key=None, reverse=False), a)
            print(a.reverse(), a)
            b = a.copy()
            print(b, a)
            print(a.clear(), a)
            print(b)  # ensure b is not still linked to a

            # Test empty lists.
            a = []
            print(a.append(1), a)
            a = []
            print(a.extend([]), a)
            a = []
            print(a.insert(0, 1), a)
            a = []
            print(a.insert(50, 2), a)
            a = []
            try:
                print(a.remove(0), a)
            except ValueError as e:
                print(e)
            a = []
            print(a.sort(), a)
            a = []
            print(a.reverse(), a)
            a = []
            print(a.copy(), a)
            """)

    def test_slice_operations(self):
        'Reference: https://docs.python.org/3/tutorial/datastructures.html'

        self.assertCodeExecution("""
            a = [1, 5, 3]

            print(a[-1])
            print(a[-1:])
            print(a[:-1])

            a[len(a):] = [1]
            print("Insert: ", a)

            del a[0]
            print("Del one item: ", a)

            del a[:]
            print("Clear: ", a)

            a = [1, 5, 3]
            del a[1:]
            print("Del slice: ", a)

            # empty lists
            a = []
            print(a[-1:])
            print(a[:-1])
            try:
                print(a[-1])
            except IndexError as e:
                print(e)
        """)

    def test_comprehensions(self):
        'Reference: https://docs.python.org/3/tutorial/datastructures.html'
        self.assertCodeExecution("""
            matrix = [
                [1, 2, 3, 4],
                [5, 6, 7, 8],
                [9, 10, 11, 12],
                ]
            print([[row[i] for row in matrix] for i in range(4)])
        """)


class BuiltinListFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "list"
