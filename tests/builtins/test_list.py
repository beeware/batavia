from .. utils import TranspileTestCase, BuiltinFunctionTestCase
from unittest import expectedFailure


class ListTests(TranspileTestCase):
    '''Tests for lists callable'''
    def test_empty_list(self):
        self.assertCodeExecution("""
            print(list())
            """)

    def test_list_with_args(self):
        self.assertCodeExecution("""
            l = list((1, 2, 3))
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
            print('Success!')
            """)

    def test_list_from_iterables(self):
        self.assertCodeExecution("""
            t = (1, 2, 3)
            def iter:
                yield 1
                yield 2
                yield 3
        
            print(list(t))
            print(list(iter()))
            """)

    # Credit: https://docs.python.org/3/tutorial/datastructures.html
    def test_slice_operations(self):
        self.assertCodeExecution("""
            a = [1, 5, 3]

            print("a[-1] -> ", a[-1])
            print("a[-1:] -> ", a[-1:])
            print("a[:-1] -> ", a[:-1])

            del a[0]
            print("del a[0] -> ", a)

            del a[:]
            print("del a[:] -> ", a)

            a = [1, 5, 3]
            del a[1:]
            print("del a[1:] -> ", a)

            # empty lists
            a = []
            print(a[-1:])
            print(a[:-1])
            try:
                print(a[-1])
            except IndexError as e:
                print(e)
        """)

    @expectedFailure
    def test_insert_with_slice(self):
        self.assertCodeExecution("""
            a = [1, 2, 3]
            a[len(a):] = [1]  # should append to the end
            print("a[len(a):] = [1] -> ", a)
        """)


class BuiltinListFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "list"
