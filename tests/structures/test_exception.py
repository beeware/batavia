from unittest import expectedFailure
from ..utils import TranspileTestCase


class ExceptionTests(TranspileTestCase):
    def test_raise(self):
        # Caught exception
        self.assertCodeExecution("""
            raise KeyError("This is the name")
            """)

    def test_raise_catch(self):
        self.assertCodeExecution("""
            try:
                raise KeyError("This is the name")
            except KeyError:
                print("Got a Key Error")
            print('Done.')
            """)

    @expectedFailure
    def test_custom_exception(self):
        self.assertCodeExecution("""
            class Ex(Exception):
                pass
            try:
                raise Ex
            except Ex as err:
                print(type(err), err)
        """)

    def test_raise_type(self):
        self.assertCodeExecution("""
            try:
                raise Exception
            except Exception as err:
                print(type(err), err)
        """)
