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
        def escape(s):
            # escape all the things.
            return s.replace("\\", "\\\\").replace("'", "\\'")

        test_strs = [
                '''print(repr(ValueError('')))''',
                '''print(repr(ValueError('"')))''',
                '''print(repr(ValueError("'")))''',
                """print(repr(ValueError("\\"'")))""",
                """print(repr(ValueError([1, 2, 3])))"""
        ]

        # Join and add a debug line above the strings.
        test_code = '\n'.join(
                [
                    "print('>>> " + escape(s) + "')\n" + s
                    for s in test_strs
                ]
            )

        self.assertCodeExecution(test_code)
