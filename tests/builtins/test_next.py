from unittest import expectedFailure

from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class NextTests(TranspileTestCase):
    @expectedFailure
    def test_next_success(self):
        self.assertCodeExecution("""
            i = iter([1])
            print(next(i))
        """)

    @expectedFailure
    def test_next_success_with_default(self):
        self.assertCodeExecution("""
            i = iter([1])
            print(next(i, 0))
        """)

    @expectedFailure
    def test_next_exhausted_with_default(self):
        self.assertCodeExecution("""
            i = iter([])
            print(next(i, 0))
        """)

    @expectedFailure
    def test_next_exhausted_without_default(self):
        self.assertCodeExecution("""
            i = iter([])
            print(next(i))
        """)


class BuiltinNextFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["next"]

    not_implemented = [
        'test_bool',
        'test_bytearray',
        'test_bytes',
        'test_class',
        'test_complex',
        'test_dict',
        'test_float',
        'test_frozenset',
        'test_int',
        'test_list',
        'test_None',
        'test_NotImplemented',
        'test_range',
        'test_set',
        'test_slice',
        'test_str',
        'test_tuple',
    ]
