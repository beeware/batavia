from ..utils import ModuleFunctionTestCase, TranspileTestCase


class Base64Tests(ModuleFunctionTestCase, TranspileTestCase):
    def test_b64encode(self):
        self.assertCodeExecution("""
            import base64
            print(base64.b64encode(b'foo'))
            print(type(base64.b64encode(b'foo')))
            """)

    def test_b64decode(self):
        self.assertCodeExecution("""
            import base64
            print(str(base64.b64decode(b'Zm9v')))
            print(type(base64.b64decode(b'Zm9v')))
            """)

    def test_decodestring(self):
        self.assertCodeExecution("""
            import base64
            print(base64.decodestring(b'Zm9v'))
            print(type(base64.decodestring(b'Zm9v')))
            """)

    def test_urlsafe_b64decode(self):
        self.assertCodeExecution("""
            import base64
            print(str(base64.urlsafe_b64decode(b'aHR0cDovL2dvb2dsZS5jb20=')))
            print(type(base64.urlsafe_b64decode(b'aHR0cDovL2dvb2dsZS5jb20=')))
            """)

    def test_urlsafe_b64encode(self):
        self.assertCodeExecution("""
            import base64
            print(base64.urlsafe_b64encode(b'http://www.google.com/'))
            print(type(base64.urlsafe_b64encode(b'http://www.google.com/')))
            """)
