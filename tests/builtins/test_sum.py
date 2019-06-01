import re

from ..utils import TranspileTestCase, BuiltinFunctionTestCase, BuiltinTwoargFunctionTestCase, SAMPLE_SUBSTITUTIONS


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
    substitutions = SAMPLE_SUBSTITUTIONS.copy()
    substitutions.update({
        'Error\'> : unsupported operand type(s) for +: other type and one of float, str or int': [
            re.compile(
                r"'TypeError'> : unsupported operand type\(s\) for \+: '(float|str|int)' and '(float|str|int)'"),
            re.compile("'OverflowError'> : int too large to convert to float"),
        ],
    })


class BuiltinSumTwoArgFunctionTests(BuiltinTwoargFunctionTestCase, TranspileTestCase):
    function = "sum"
    substitutions = SAMPLE_SUBSTITUTIONS.copy()
    substitutions.update({
        'unsupported operand type(s) for +: other type and one of float, str or int': [
            re.compile(r"<class 'TypeError'> : unsupported operand type\(s\) for \+: '([^']+)' and '(float|str|int)'"),
            re.compile("<class 'OverflowError'> : int too large to convert to float"),
        ],
        'can only concatenate list-type (not float, str or int) to the same list-type': [
            re.compile(r"can only concatenate (tuple|list) \(not \"(float|str|int)\"\) to \1")
        ]
    })
