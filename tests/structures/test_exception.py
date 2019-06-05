from unittest import expectedFailure
from ..utils import TranspileTestCase


class ExceptionTests(TranspileTestCase):
    def test_raise(self):
        # Caught exception
        self.assertCodeExecution("""
            raise KeyError("This is the name")
            """, allow_exceptions=True)

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

    def test_raise_inside_loop(self):
        self.assertCodeExecution("""
            for x in ['a', 'b']:  # same for ['a']
                try:
                    raise Exception()
                except:
                    print(x)
        """)

    def test_repr(self):
        self.assertCodeExecution("""
            print('>>> print(repr(ValueError()))')
            print(repr(ValueError('')))
            print('>>> print(repr(ValueError(\\'\\')))')
            print(repr(ValueError('')))
            print('>>> print(repr(ValueError(\\'"\\')))')
            print(repr(ValueError('"')))
            print('>>> print(repr(ValueError("\\'")))')
            print(repr(ValueError("'")))
            print('>>> print(repr(ValueError("\\"\\'")))')
            print(repr(ValueError("\\"'")))
            print('>>> print(repr(ValueError([1, 2, 3])))')
            print(repr(ValueError([1, 2, 3])))
            print('>>> print(repr(ValueError([1], 1, \\'1\\')))')
            print(repr(ValueError([1], 1, '1')))
        """)

    def test_str(self):
        self.assertCodeExecution("""
            print('>>> print(str(ValueError()))')
            print(repr(ValueError('')))
            print('>>> print(str(ValueError(\\'\\')))')
            print(repr(ValueError('')))
            print('>>> print(str(ValueError(\\'"\\')))')
            print(repr(ValueError('"')))
            print('>>> print(str(ValueError("\\'")))')
            print(repr(ValueError("'")))
            print('>>> print(str(ValueError("\\"\\'")))')
            print(repr(ValueError("\\"'")))
            print('>>> print(str(ValueError([1, 2, 3])))')
            print(repr(ValueError([1, 2, 3])))
            print('>>> print(str(ValueError([1], 1, \\'1\\')))')
            print(repr(ValueError([1], 1, '1')))
        """)
