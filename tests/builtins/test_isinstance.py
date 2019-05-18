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


class BytearrayIsinstanceFunctionTest(BuiltinFunctionTestCase, TranspileTestCase):
    function = "lambda a: isinstance(a, bytearray)"


class BytesIsinstanceFunctionTest(BuiltinFunctionTestCase, TranspileTestCase):
    function = "lambda a: isinstance(a, bytes)"


class ComplexIsinstanceFunctionTest(BuiltinFunctionTestCase, TranspileTestCase):
    function = "lambda a: isinstance(a, complex)"


class DictIsinstanceFunctionTest(BuiltinFunctionTestCase, TranspileTestCase):
    function = "lambda a: isinstance(a, dict)"


class FilterIsinstanceFunctionTest(BuiltinFunctionTestCase, TranspileTestCase):
    function = "lambda a: isinstance(a, filter)"


class FloatIsinstanceFunctionTest(BuiltinFunctionTestCase, TranspileTestCase):
    function = "lambda a: isinstance(a, float)"


class FrozensetIsinstanceFunctionTest(BuiltinFunctionTestCase, TranspileTestCase):
    function = "lambda a: isinstance(a, frozenset)"


class IntIsinstanceFunctionTest(BuiltinFunctionTestCase, TranspileTestCase):
    function = "lambda a: isinstance(a, int)"
    not_implemented = [
        "test_bool",
    ]


class ListIsinstanceFunctionTest(BuiltinFunctionTestCase, TranspileTestCase):
    function = "lambda a: isinstance(a, list)"


class MapIsinstanceFunctionTest(BuiltinFunctionTestCase, TranspileTestCase):
    function = "lambda a: isinstance(a, map)"


class MemoryviewIsinstanceFunctionTest(BuiltinFunctionTestCase, TranspileTestCase):
    function = "lambda a: isinstance(a, memoryview)"

    not_implemented = [
        "test_None",
        "test_NotImplemented",
        "test_bool",
        "test_bytearray",
        "test_bytes",
        "test_class",
        "test_complex",
        "test_dict",
        "test_float",
        "test_frozenset",
        "test_int",
        "test_list",
        "test_range",
        "test_set",
        "test_slice",
        "test_str",
        "test_tuple",
    ]


class RangeIsinstanceFunctionTest(BuiltinFunctionTestCase, TranspileTestCase):
    function = "lambda a: isinstance(a, range)"


class SetIsinstanceFunctionTest(BuiltinFunctionTestCase, TranspileTestCase):
    function = "lambda a: isinstance(a, set)"


class StrIsinstanceFunctionTest(BuiltinFunctionTestCase, TranspileTestCase):
    function = "lambda a: isinstance(a, str)"


class TupleIsinstanceFunctionTest(BuiltinFunctionTestCase, TranspileTestCase):
    function = "lambda a: isinstance(a, tuple)"


class TypeIsinstanceFunctionTest(BuiltinFunctionTestCase, TranspileTestCase):
    function = "lambda a: isinstance(a, type)"


class BuiltinIsinstanceFunctionTests(BuiltinTwoargFunctionTestCase, TranspileTestCase):
    function = "isinstance"

    not_implemented = [
        "test_bool_class",
    ]
