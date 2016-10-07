from ..utils import TranspileTestCase

import unittest

class CompileTests(TranspileTestCase):
    def test_get_token(self):
        self.assertJavaScriptExecution("""
            import _compile
            tok = _compile.Tokenizer("x = 1")
            print(tok.get_token())
            print(tok.get_token())
            print(tok.get_token())
            """,
            """
            1,0,1
            22,2,3
            2,4,4
            """)
