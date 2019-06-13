from .. utils import TranspileTestCase, BuiltinFunctionTestCase
from unittest import expectedFailure


class ListTests(TranspileTestCase):
    def test_list(self):
        self.assertCodeExecution("""
            print([])
            print(list())
            """)

    def test_list_callable_with_args(self):
        self.assertCodeExecution("""
            print([1, 2, 3])
            print(list((1, 2, 3)))
            try:
                print(">>> list(1, 2)")
                list(1, 2)
            except TypeError as e:
                print(e)
            """)

    def test_list_callable_with_kwargs(self):
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
            if a != b or a is not b:
                raise Exception("Test failed. a == b: ", a == b, "a is b", a is b)

            print("Test shallow copy")
            x = [1]
            y = [x]
            assert y.copy()[0] is x
            """)

    def test_list_operations(self):
        # Print the result of the method to ensure it returns the correct output, even if None
        # Print the list after every operation to ensure it returns the correct output
        self.assertCodeExecution("""
            a = [5, 2, 4, 3, 1]

            print(".append: ", a.append(6), a)
            print(".extend: ", a.extend([8, 9, 10]), a)
            print(".insert: ", a.insert(2, 3.5), a)
            print(".remove: ", a.remove(4), a)
            print(".pop: ", a.pop(), a)
            print(".pop(index): ", a.pop(2), a)
            print(".index: ", a.index(5))
            print(".count: ", [0, 2, 0, 2, 2].count(2))
            print(".sort: ", a.sort(key=None, reverse=True), a.sort(key=None, reverse=False), a)
            print(".reverse: ", a.reverse(), a)
            b = a.copy()
            print(".copy: ", b, a)
            print(".clear: ", a.clear(), a)
            print("Ensure copy is not still linked: ", b)

            try:
                print(a.index(100))
            except ValueError as e:
                print(e)

            print("Empty list tests.")
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

    # Credit: https://docs.python.org/3/tutorial/datastructures.html
    def test_slice_operations(self):
        self.assertCodeExecution("""
            a = [1, 5, 3]

            print("a[-1] -> ", a[-1])
            print("a[-1:] -> ", a[-1:])
            print("a[:-1] -> ", a[:-1])

            # a[len(a):] = [1]
            # print("a[len(a):] = [1] -> ", a)

            del a[0]
            print("del a[0] -> ", a)

            del a[:]
            print("del a[:] -> ", a)

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
        'Credit: https://docs.python.org/3/tutorial/datastructures.html'
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
