from ..utils import TranspileTestCase, BuiltinFunctionTestCase, BuiltinTwoargFunctionTestCase

import unittest


class IsinstanceTests(TranspileTestCase):
    def test_not_str(self):
        self.assertCodeExecution("""
        class A:
            pass
        print(isinstance(A(), str))
        """)

    def test_common_types(self):
        self.assertCodeExecution("""
        print(isinstance(1, int))
        print(isinstance(1.0, int))
        print(isinstance(1.0, float))
        print(isinstance(True, bool))
        print(isinstance("a", str))
        """)

    @unittest.expectedFailure
    def test_type_equality(self):
        self.assertCodeExecution("""
        print(isinstance(123, int))

        class A:
            pass
        a = A()
        print(isinstance(a, A))
        print(isinstance(a, object))
        """)


class BoolIsinstanceFunctionTest(BuiltinFunctionTestCase, TranspileTestCase):
    function = "lambda a: isinstance(a, bool)"
    not_implemented = ["test_noargs"]


class BytearrayIsinstanceFunctionTest(BuiltinFunctionTestCase, TranspileTestCase):
    function = "lambda a: isinstance(a, bytearray)"
    not_implemented = ["test_noargs"]


class BytesIsinstanceFunctionTest(BuiltinFunctionTestCase, TranspileTestCase):
    function = "lambda a: isinstance(a, bytes)"
    not_implemented = ["test_noargs"]


class ComplexIsinstanceFunctionTest(BuiltinFunctionTestCase, TranspileTestCase):
    function = "lambda a: isinstance(a, complex)"
    not_implemented = ["test_noargs"]


class DictIsinstanceFunctionTest(BuiltinFunctionTestCase, TranspileTestCase):
    function = "lambda a: isinstance(a, dict)"
    not_implemented = ["test_noargs"]


class FilterIsinstanceFunctionTest(BuiltinFunctionTestCase, TranspileTestCase):
    function = "lambda a: isinstance(a, filter)"
    not_implemented = ["test_noargs"]


class FloatIsinstanceFunctionTest(BuiltinFunctionTestCase, TranspileTestCase):
    function = "lambda a: isinstance(a, float)"
    not_implemented = ["test_noargs"]


class FrozensetIsinstanceFunctionTest(BuiltinFunctionTestCase, TranspileTestCase):
    function = "lambda a: isinstance(a, frozenset)"
    not_implemented = ["test_noargs"]


class IntIsinstanceFunctionTest(BuiltinFunctionTestCase, TranspileTestCase):
    function = "lambda a: isinstance(a, int)"
    not_implemented = [
        "test_bool",
        "test_noargs",
    ]


class ListIsinstanceFunctionTest(BuiltinFunctionTestCase, TranspileTestCase):
    function = "lambda a: isinstance(a, list)"
    not_implemented = ["test_noargs"]


class MapIsinstanceFunctionTest(BuiltinFunctionTestCase, TranspileTestCase):
    function = "lambda a: isinstance(a, map)"
    not_implemented = ["test_noargs"]


@unittest.expectedFailure
class MemoryviewIsinstanceFunctionTest(BuiltinFunctionTestCase, TranspileTestCase):
    function = "lambda a: isinstance(a, memoryview)"
    not_implemented = ["test_noargs"]


class RangeIsinstanceFunctionTest(BuiltinFunctionTestCase, TranspileTestCase):
    function = "lambda a: isinstance(a, range)"
    not_implemented = ["test_noargs"]


class SetIsinstanceFunctionTest(BuiltinFunctionTestCase, TranspileTestCase):
    function = "lambda a: isinstance(a, set)"
    not_implemented = ["test_noargs"]


class StrIsinstanceFunctionTest(BuiltinFunctionTestCase, TranspileTestCase):
    function = "lambda a: isinstance(a, str)"
    not_implemented = ["test_noargs"]


class TupleIsinstanceFunctionTest(BuiltinFunctionTestCase, TranspileTestCase):
    function = "lambda a: isinstance(a, tuple)"
    not_implemented = ["test_noargs"]


class TypeIsinstanceFunctionTest(BuiltinFunctionTestCase, TranspileTestCase):
    function = "lambda a: isinstance(a, type)"
    not_implemented = ["test_noargs"]


class BuiltinIsinstanceFunctionTests(BuiltinTwoargFunctionTestCase, TranspileTestCase):
    function = "isinstance"

    not_implemented = [
        "test_bool_class",
    ]
