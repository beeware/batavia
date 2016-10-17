import sys
from unittest import skipUnless

from ..utils import ModuleFunctionTestCase, TranspileTestCase


class Base64Tests(ModuleFunctionTestCase, TranspileTestCase):
    def test_b64encode(self):
        self.assertCodeExecution("""
            import base64

            print(base64.b64encode(b'Foo'))
            """)

    def test_b64decode(self):
        self.assertCodeExecution("""
            import base64

            print(base64.b64decode('Rm9v'))
            """)
