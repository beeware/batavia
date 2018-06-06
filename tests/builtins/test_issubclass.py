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
		print(issubclass(bool, int))
		print(issubclass(list, list))
		print(issubclass(tuple, tuple))
		print(issubclass(int, str))
		print(issubclass(int, bool))
		print(issubclass(tuple, frozenset))
		print(issubclass(bool, (str, int)))
		""")	


class BuiltinIssubclassFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
	function = "issubclass"