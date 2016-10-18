import sys
from unittest import skipUnless

from ..utils import ModuleFunctionTestCase, TranspileTestCase


class Base64Tests(ModuleFunctionTestCase, TranspileTestCase):
    def test_b64encode(self):
        self.assertCodeExecution("""
            import base64
            print(base64.b64encode(b'foo'))
            """)

    def test_b64decode(self):
        self.assertCodeExecution("""
            import base64

            print(str(base64.b64decode(b'Zm9v')))
            """)

    def test_urlsafe_b64encode(self):
        self.assertCodeExecution("""
            import base64

            print(base64.b64encode(b'))
            """)