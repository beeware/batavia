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
		print("bool is a subclass of int?:", issubclass(bool, int))
		print("int is a subclass of bool?:", issubclass(int, str))
		print("bool is a subclass of str or int?:", issubclass(bool, (str, int)))
		""")	


class BuiltinIssubclassFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
	function = "issubclass"