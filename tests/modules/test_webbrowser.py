from ..utils import ModuleFunctionTestCase, TranspileTestCase

class Base64Tests(ModuleFunctionTestCase, TranspileTestCase):
    def test_import(self):
        self.assertCodeExecution("import webbrowser")

