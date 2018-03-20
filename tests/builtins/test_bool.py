from .. utils import TranspileTestCase, BuiltinFunctionTestCase

import unittest


class BoolTests(TranspileTestCase):
    def test_bool_omitted(self):
        self.assertCodeExecution("""
            print(bool())
            """)

    def test_bool_like(self):
        self.assertCodeExecution("""
            class BoolLike:
                def __init__(self, val):
                    self.val = val

                def __bool__(self):
                    return self.val == 1
            print(bool(BoolLike(0)))
            print(bool(BoolLike(1)))
            """)

    def test_len_only(self):
        self.assertCodeExecution("""
            class LenButNoBool:
                def __init__(self, val):
                    self.val = val

                def __len__(self):
                    return self.val

            print(bool(LenButNoBool(0)))
            print(bool(LenButNoBool(1)))
            """)

    def test_no_bool_no_len(self):
        self.assertCodeExecution("""
            class NoLenNoBool:
                def __init__(self, val):
                    self.val = val

            print(bool(NoLenNoBool(0)))
            print(bool(NoLenNoBool(1)))
            print(bool(NoLenNoBool(42)))
            print(bool(NoLenNoBool(-2)))
            """)

    def test_bool_malicious(self):
        self.assertCodeExecution("""
            class BoolHate:
                def __init__(self, val):
                    self.val = val

                def __bool__(self):
                    return self.val

            try:
                print(bool(BoolHate("zero")))
            except Exception as e:
                print(type(e), ':', e)

            try:
                print(bool(BoolHate([1, 2, 3])))
            except Exception as e:
                print(type(e), ':', e)

            try:
                print(bool(BoolHate({1: 2})))
            except Exception as e:
                print(type(e), ':', e)

            try:
                print(bool(BoolHate(1.2)))
            except Exception as e:
                print(type(e), ':', e)

            try:
                print(bool(BoolHate("👿")))
            except Exception as e:
                print(type(e), ':', e)
        """)

    def test_len_malicious(self):
        self.assertCodeExecution("""
            class LenHate:
                def __init__(self, val):
                    self.val = val

                def __len__(self):
                    return self.val

            try:
                print(bool(LenHate("zero")))
            except Exception as e:
                print(type(e), ':', e)

            try:
                print(bool(LenHate([1, 2, 3])))
            except Exception as e:
                print(type(e), ':', e)

            try:
                print(bool(LenHate({1: 2})))
            except Exception as e:
                print(type(e), ':', e)

            try:
                print(bool(LenHate(1.2)))
            except Exception as e:
                print(type(e), ':', e)

            try:
                print(bool(LenHate("👿")))
            except Exception as e:
                print(type(e), ':', e)
        """)


class BuiltinBoolFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "bool"
