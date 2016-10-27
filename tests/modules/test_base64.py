from ..utils import ModuleFunctionTestCase, TranspileTestCase


class Base64Tests(ModuleFunctionTestCase, TranspileTestCase):
    def test_b64encode(self):
        self.assertCodeExecution("""
            import base64
            print(base64.b64encode(b'foo'))
            print(type(base64.b64encode(b'foo')))
            print(base64.b64encode(b'\xfb\xfc\xe6', b'-_'))
            """)

    def test_b64decode(self):
        self.assertCodeExecution("""
            import base64
            print(str(base64.b64decode(b'Zm9v')))
            print(type(base64.b64decode(b'Zm9v')))
            print(base64.b64decode(b'Zm9vKy8='))
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
            print(type(base64.b64decode(b'aHR0cDovL2dvb2dsZS5jb20=')))
            print(base64.urlsafe_b64decode(b'Zm9vYmFyYmF6LisvLmNvbQ=='))
            """)

    def test_urlsafe_b64encode(self):
        self.assertCodeExecution("""
            import base64
            print(base64.urlsafe_b64encode(b'http://www.google.com/'))
            print(type(base64.urlsafe_b64encode(b'http://www.google.com/')))
            print(base64.urlsafe_b64encode(b'~\x8a\x1bj\xb6\xda\xcf\xef\xdc'))
            """)
