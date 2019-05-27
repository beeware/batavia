from ..utils import TranspileTestCase, BuiltinFunctionTestCase, BuiltinTwoargFunctionTestCase


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

    def test_sum_kwargs(self):
        self.assertCodeExecution("""
            try:
                print(sum(x=1))
            except TypeError as e:
                print(e)
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


class BuiltinSumTwoArgFunctionTests(BuiltinTwoargFunctionTestCase, TranspileTestCase):
    function = "sum"

    # these are implemented, but the exact exception thrown depends on the order
    # that they are iterated on being the exact same in both CPython and batavia,
    # which is not guaranteed. (if an unsupported string follows an int, the error
    # will be different than if it followed a float)

    is_flakey = [
        "test_frozenset_None",
        "test_frozenset_NotImplemented",
        "test_frozenset_bool",
        "test_frozenset_class",
        "test_frozenset_dict",
        "test_frozenset_frozenset",
        "test_frozenset_int",
        "test_frozenset_list",
        "test_frozenset_range",
        "test_frozenset_set",
        "test_frozenset_slice",
        "test_frozenset_tuple",
        "test_set_None",
        "test_set_NotImplemented",
        "test_set_bool",
        "test_set_class",
        "test_set_dict",
        "test_set_frozenset",
        "test_set_int",
        "test_set_list",
        "test_set_range",
        "test_set_set",
        "test_set_slice",
        "test_set_tuple",
    ]
