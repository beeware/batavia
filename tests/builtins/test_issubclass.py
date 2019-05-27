from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class IssubclassTests(TranspileTestCase):
    def test_custom_class(self):
        self.assertCodeExecution("""
        class Oval:
            pass
        class Circle(Oval):
            pass
        print(issubclass(Circle, Oval))
        print(issubclass(Circle, Circle))
        print(issubclass(Circle, list))
        print(issubclass(Circle, (list, Oval, tuple)))
        """)

    def test_py_class(self):
        self.assertCodeExecution("""
        print("bool is subclass of int:", issubclass(bool, int))
        print("list is subclass of list:", issubclass(list, list))
        print("tuple is subclass of tuple:", issubclass(tuple, tuple))
        print("int is subclass of str:", issubclass(int, str))
        print("int is subclass of bool:", issubclass(int, bool))
        print("tuple is subclass of frozenset:", issubclass(tuple, frozenset))
        print("bool is subclass of str or int:", issubclass(bool, (str, int)))
        """)


class BuiltinIssubclassFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "issubclass"
