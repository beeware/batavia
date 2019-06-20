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


class BuiltinListFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "list"
