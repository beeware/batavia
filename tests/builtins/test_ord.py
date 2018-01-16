from .. utils import TranspileTestCase, BuiltinFunctionTestCase
import unittest
import string


class OrdTests(TranspileTestCase):
    def test_ord_ascii(self):
        tests = []
        for char in string.ascii_letters:
            tests.append("print(ord('%s'))" % char)
            tests.append("print(ord(b'%s'))" % char)
        self.assertCodeExecution("\n".join(tests))

    def test_ord_unicode(self):
        letters = ',!}12 中한πß≈ऋ㍿'
        tests = []
        for char in letters:
            tests.append("print(ord('%s'))" % char)
        self.assertCodeExecution("\n".join(tests))

    @unittest.expectedFailure
    def test_ord_emoji(self):
        # Emojis have length of 2 in JavaScript since JS uses UTF-16
        self.assertCodeExecution("""
            try:
                print(ord('🐝'))
            except TypeError as e:
                print(e)
        """)

    def test_ord_exceptins(self):
        self.assertCodeExecution("""
            try:
                print(ord("bc"))
            except TypeError as e:
                print(e)
            try:
                print(ord(b"bc"))
            except TypeError as e:
                print(e)
            try:
                print(ord(""))
            except TypeError as e:
                print(e)
        """)


class BuiltinOrdFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "ord"
