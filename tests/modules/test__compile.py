from ..utils import TranspileTestCase

import unittest

class CompileTests(TranspileTestCase):
    def test_get_token(self):
        self.assertJavaScriptExecution("""
            import _compile
            s = "x = 1; fun.w3 -= 14.0e4j"
            tok = _compile.Tokenizer(s)
            for i in range(20):
              t = tok.get_token()
              if t is None:
                break
              token, a, b = str(t).split(",")
              print(i, token, s[int(a):int(b)])
            """,
            """
            0 1 x
            1 22 =
            2 2 1
            3 13 ;
            4 1 fun
            5 23 .
            6 1 w3
            7 37 -=
            8 2 14.0e4j
            """)
