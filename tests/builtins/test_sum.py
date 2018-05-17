from unittest import expectedFailure

from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class SumTests(TranspileTestCase):
    def test_sum_empty_list(self):
        self.assertCodeExecution("""
            print(sum([]))
        """)

    def test_sum_list(self):
        self.assertCodeExecution("""
            print(sum([1, 2, 3, 4, 5, 6, 7]))
        """)

    def test_sum_tuple(self):
        self.assertCodeExecution("""
            print(sum((1, 2, 3, 4, 5, 6, 7)))
        """)

    @expectedFailure
    def test_sum_iterator(self):
        self.assertCodeExecution("""
            i = iter([1, 2])
            print(sum(i))
            print(sum(i))
        """)

    def test_sum_mix_floats_and_ints(self):
        self.assertCodeExecution("""
            print(sum([1, 1.414, 2, 3.14159]))
        """)


class BuiltinSumFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "sum"

    # these are implemented, but the exact exception thrown depends on the order
    # that they are iterated on being the exact same in both CPython and batavia,
    # which is not guaranteed. (if an unsupported string follows an int, the error
    # will be different than if it followed a float)

    is_flakey = [
        'test_frozenset',  # This works, but python dict.keys() returns non-deterministically
        'test_set',  # This works, but python dict.keys() returns non-deterministically.
    ]

    not_implemented = [
        'test_range',  # This has been implemented, but fails upstream on isinstance.
    ]
