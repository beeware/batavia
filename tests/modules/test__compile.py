from ..utils import TranspileTestCase

import unittest

pystone = '''
LOOPS = 50000

from time import clock

__version__ = "1.2"

[Ident1, Ident2, Ident3, Ident4, Ident5] = range(1, 6)
'''



class CompileTests(TranspileTestCase):
    def test_basic_tokenize(self):
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
            0 NAME x
            1 EQUAL =
            2 NUMBER 1
            3 SEMI ;
            4 NAME fun
            5 DOT .
            6 NAME w3
            7 MINEQUAL -=
            8 NUMBER 14.0e4j
            """)
    def test_advance_tokenize(self):
        self.assertJavaScriptExecution("""
            import _compile
            s = %s
            tok = _compile.Tokenizer(s)
            for i in range(100):
              t = tok.get_token()
              if t is None:
                break
              token, a, b = str(t).split(",")
              print(i, token, s[int(a):int(b)])
            """ % repr(pystone),
            """
            0 NEWLINE
            1 NAME LOOPS
            2 EQUAL =
            3 NUMBER 50000
            4 NEWLINE
            5 NEWLINE
            6 NAME from
            7 NAME time
            8 NAME import
            9 NAME clock
            10 NEWLINE
            11 NEWLINE
            12 NAME __version__
            13 EQUAL =
            14 STRING "1.2"
            15 NEWLINE
            16 NEWLINE
            17 LSQB [
            18 NAME Ident1
            19 COMMA ,
            20 NAME Ident2
            21 COMMA ,
            22 NAME Ident3
            23 COMMA ,
            24 NAME Ident4
            25 COMMA ,
            26 NAME Ident5
            27 RSQB ]
            28 EQUAL =
            29 NAME range
            30 LPAR (
            31 NUMBER 1
            32 COMMA ,
            33 NUMBER 6
            34 RPAR )
            """)
