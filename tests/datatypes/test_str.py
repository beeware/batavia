from .. utils import TranspileTestCase, UnaryOperationTestCase, BinaryOperationTestCase, InplaceOperationTestCase, \
    adjust, transforms, SAMPLE_DATA

from itertools import product
import unittest


class StrTests(TranspileTestCase):
    def test_truthiness(self):
        self.assertCodeExecution("""
            x = "A string"
            if x:
                print("x is True")
            else:
                print("x is False")

            y = ""
            if y:
                print("y is True")
            else:
                print("y is False")

            print('Done.')
            """)

    def test_setattr(self):
        self.assertCodeExecution("""
            x = "Hello, world"
            x.attr = 42
            print('Done.')
            """)

    def test_getattr(self):
        self.assertCodeExecution("""
            x = "Hello, world"
            print(x.attr)
            print('Done.')
            """)

    def test_getitem(self):
        # Simple positive index
        self.assertCodeExecution("""
            x = 'abcde'
            print(x[2])
            """)

        # Simple negative index
        self.assertCodeExecution("""
            x = 'abcde'
            print(x[-2])
            """)

        # Positive index out of range
        self.assertCodeExecution("""
            x = 'abcde'
            print(x[10])
            """)

        # Negative index out of range
        self.assertCodeExecution("""
            x = 'abcde'
            print(x[-10])
            """)

    def test_slice(self):
        # Full slice
        self.assertCodeExecution("""
            x = 'abcde'
            print(x[:])
            """)

        # Left bound slice
        self.assertCodeExecution("""
            x = 'abcde'
            print(x[1:])
            """)

        # Right bound slice
        self.assertCodeExecution("""
            x = 'abcde'
            print(x[:4])
            """)

        # Slice bound in both directions
        self.assertCodeExecution("""
            x = 'abcde'
            print(x[1:4])
            """)

        # Slice with step 0 (error)
        self.assertCodeExecution("""
            x = 'abcde'
            print(x[::0])
            """)

        # Slice with revese step
        self.assertCodeExecution("""
            x = 'abcde'
            print(x[::-1])
            """)

        # Slice -1 stop with reverse step
        self.assertCodeExecution("""
            x = 'abcde'
            print(x[-5:-1:-1])
            """)

        # Slice -1 start with revese step
        self.assertCodeExecution("""
            x = 'abcde'
            print(x[-1:0:-1])
            """)

    def test_startswith(self):
        self.assertCodeExecution("""
            # Single character
            if 'BeeWare'.startswith('B'):
                print('BeeWare starts with B')
            else:
                print('BeeWare does not start with B')

            # Substring
            if 'BeeWare'.startswith('Bee'):
                print('BeeWare starts with Bee')
            else:
                print('BeeWare does not start with Bee')

            # Invalid substring
            if 'BeeWare'.startswith('Ware'):
                print('BeeWare starts with Ware')
            else:
                print('BeeWare does not start with Ware')

            # Superstring
            if 'BeeWare'.startswith('BeeWare-shaves-yaks'):
                print('BeeWare starts with BeeWare-shaves-yaks')
            else:
                print('BeeWare does not start with BeeWare-shaves-yaks')

            # Empty string
            if 'BeeWare'.startswith(''):
                print('BeeWare starts with an empty string')
            else:
                print('BeeWare does not start with an empty string')

            # Starts with an int
            try:
                'BeeWare'.startswith(5)
            except TypeError:
                print('TypeError thrown appropriately for '
                      'str.startswith() for non-str or non-tuple of str')
            else:
                print('No error thrown for invalid type!')

            # Starts with a dict
            try:
                'BeeWare'.startswith({})
            except TypeError:
                print('TypeError thrown appropriately for '
                      'str.startswith() for non-str or non-tuple of str')
            else:
                print('No error thrown for invalid type!')

            print('done.')
        """)

    def test_swapcase(self):
        self.assertCodeExecution("""
            test = ["test", "Test", "This Is a, Test", "", "Êć What is This?", ",./12"]
            for x in test:
                print(x.swapcase())
            print("test passed")
        """)

    def test_startswith_no_args(self):
        self.assertCodeExecution("""
            try:
                'BeeWare'.startswith()
            except TypeError as err:
                print(err)
            else:
                print('No exception for ommitted arguments')
         """)

    def test_startswith_multiple_args(self):
        self.assertCodeExecution("""
            try:
                'BeeWare'.startswith('B', 'e')
            except TypeError as err:
                print(err)
            else:
                print('No exception for multiple arguments')
         """)


    def test_startswith_tuple(self):
        self.assertCodeExecution("""
            try:
                assert 'BeeWare'.startswith(('e', 'B'))
            except AssertionError:
                print('BeeWare does not start with e or B')
            else:
                print('BeeWare starts with either e or B')
         """)

    def test_instring(self):
        self.assertCodeExecution("""
            # Single character at the start of the string
            if 'B' in 'BeeWare':
                print('BeeWare contains B')
            else:
                print('BeeWare does not contain B')

            # Single character elsewhere in the string
            if 'W' in 'BeeWare':
                print('BeeWare contains W')
            else:
                print('BeeWare does not contain W')

            # Substring at the start
            if 'Bee' in 'BeeWare':
                print('BeeWare contains Bee')
            else:
                print('BeeWare does not contain Bee')

            # Substring elsewhere
            if 'eWa' in 'BeeWare':
                print('BeeWare contains eWa')
            else:
                print('BeeWare does not contain eWa')

            # Empty string
            if '' in 'BeeWare':
                print('BeeWare contains an empty string')
            else:
                print('BeeWare does not contain an empty string')

            # Contains int
            try:
                5 in 'BeeWare'
            except TypeError:
                print('TypeError thrown appropriately for '
                       'in str for non-str or non-tuple of str')
            else:
                print('No error thrown for invalid type!')

            # Contains a dict
            try:
                {} in 'BeeWare'
            except TypeError:
                print('TypeError thrown appropriately for '
                      'in str for non-str or non-tuple of str')
            else:
                print('No error thrown for invalid type!')

            print('done.')
        """)

    def test_isupper(self):
        self.assertCodeExecution("""
            # Single capital
            if 'B'.isupper():
                print('B is uppercase')
            else:
                print('B is not uppercase')

            # Single lowercase
            if 'b'.isupper():
                print('b is uppercase')
            else:
                print('b is not uppercase')

            # Multiple character, all caps
            if 'BEE'.isupper():
                print('BEE is uppercase')
            else:
                print('BEE is not uppercase')

            # Multiple character, all lowercase
            if 'bee'.isupper():
                print('bee is uppercase')
            else:
                print('bee is not uppercase')

            # Multiple character, mixed case
            if 'Bee'.isupper():
                print('Bee is uppercase')
            else:
                print('Bee is not uppercase')

            # Multiple characters, all caps with digits and punctuation
            if 'B1E2E!'.isupper():
                print('B1E2E! is uppercase')
            else:
                print('B1E2E! is not uppercase')

            # Multiple characters, mixed case with digits and punctuation
            if 'B1e2E!'.isupper():
                print('B1e2E! is uppercase')
            else:
                print('B1e2E! is not uppercase')

            # Only numbers and punctuation
            if '12!3_4'.isupper():
                print('12!3_4 is uppercase')
            else:
                print('12!3_4 is not uppercase')

            print('done.')
        """)

    def test_islower(self):
        self.assertCodeExecution("""
            # Single capital
            if 'B'.islower():
                print('B is lowercase')
            else:
                print('B is not lowercase')

            # Single lowercase
            if 'b'.islower():
                print('b is lowercase')
            else:
                print('b is not lowercase')

            # Multiple character, all caps
            if 'BEE'.islower():
                print('BEE is lowercase')
            else:
                print('BEE is not lowercase')

            # Multiple character, all lowercase
            if 'bee'.islower():
                print('bee is lowercase')
            else:
                print('bee is not lowercase')

            # Multiple character, mixed case
            if 'Bee'.islower():
                print('Bee is lowercase')
            else:
                print('Bee is not lowercase')

            # Multiple character, all caps with digits and punctuation
            if 'B1E2E!'.islower():
                print('B1E2E! is lowercase')
            else:
                print('B1E2E! is not lowercase')

            # Multiple character, mixed case with digits and punctuation
            if 'B1e2E!'.islower():
                print('B1e2E! is lowercase')
            else:
                print('B1e2E! is not lowercase')

            # Only numbers and punctuation
            if '12!3_4'.islower():
                print('12!3_4 is lowercase')
            else:
                print('12!3_4 is not lowercase')

            print('done.')
        """)

    def test_lower(self):
        self.assertCodeExecution("""
            # Single character
            b = "B"
            print(b.lower())
            print(b.lower() == "b")

            # String
            bs = "BeeWare"
            print(bs.lower())
            print(bs.lower() == "beeware")
        """)

    def test_upper(self):
        self.assertCodeExecution("""
            # Single character
            b = "b"
            print(b.upper())
            print(b.upper() == "B")

            # String
            bs = "BeeWare"
            print(bs.upper())
            print(bs.upper() == "BEEWARE")
        """)

    def test_lstrip(self):
        self.assertCodeExecution("""
            # No argument passed, strip whitespace only
            x = ' Bee'
            print(x.lstrip())

            # No argument passed,string contains leading whitespace as well as whitespace in between text
            x = ' Bee Ware'
            print(x.lstrip())

            # No argument passed, strip mixed types of whicespaces
            x = '\\n \\t\\r Bee'
            print(x.lstrip())

            # No arguments passed, no leading spaces to be stripped
            x = 'Bee'
            print(x.lstrip())

            # One character string passed as argument to be stripped
            x = '! Bee'
            print(x.lstrip('!'))

            # Multiple character string passed as argument to be stripped
            x = '!=-* Bee'
            print(x.lstrip('*-=!'))

            # Multiple character string passed as argument with leading whitespace (nothing should get stripped)
            x = ' !=-*Bee'
            print(x.lstrip('*-=!'))

            # Int passed as argument (error)
            x = '111Bee'
            try:
                print(x.lstrip(1))
            except TypeError:
                print('TypeError thrown appropriately for '
                      'str.lstrip() with non-str argument')

            # Tuple passed as argument (error)
            x = '!=-* Bee'
            try:
                print(x.lstrip(('!','=')))
            except TypeError:
                print('TypeError thrown appropriately for '
                      'str.lstrip() with non-str argument')

            # List passed as argument (error)
            x = '!=-* Bee'
            try:
                print(x.lstrip((['!','='])))
            except TypeError:
                print('TypeError thrown appropriately for '
                      'str.lstrip() with non-str argument')

            # Dict passed as argument (error)
            x = ' Bee'
            try:
                print(x.lstrip({}))
            except TypeError:
                print('TypeError thrown appropriately for '
                      'str.lstrip() with non-str argument')

            # Multiple arguments passed (error)
            x = '!=-* Bee'
            try:
                print(x.lstrip('!','='))
            except TypeError:
                print('TypeError thrown appropriately for '
                      'str.lstrip() with multiple arguments')

            print('done.')
            """)

    def test_rstrip(self):
        self.assertCodeExecution("""
            # No argument passed, strip whitespace only
            x = 'Bee '
            print(x.rstrip())

            # No argument passed,string contains trailing whitespace as well as whitespace in between text
            x = 'Bee Ware '
            print(x.lstrip())

            # No argument passed, strip mixed types of whicespaces
            x = 'Bee\\n \\t\\r '
            print(x.rstrip())

            # No arguments passed, no traling spaces to be stripped
            x = 'Bee'
            print(x.rstrip())

            # One character string passed as argument to be stripped
            x = 'Bee !'
            print(x.rstrip('!'))

            # Multiple character string passed as argument to be stripped
            x = 'Bee !=-*'
            print(x.rstrip('*-=!'))

            # Multiple character string passed as argument with trailing whitespace (nothing should get stripped)
            x = 'Bee!=-* '
            print(x.rstrip('*-=!'))

            # Int passed as argument (error)
            x = 'Bee111'
            try:
                print(x.rstrip(1))
            except TypeError:
                print('TypeError thrown appropriately for '
                      'str.rstrip() with non-str argument')

            # Tuple passed as argument (error)

            x = 'Bee !=-*'
            try:
                print(x.rstrip(('!','=')))
            except TypeError:
                print('TypeError thrown appropriately for '
                      'str.rstrip() with non-str argument')

            # List passed as argument (error)
            x = 'Bee!=-*'
            try:
                print(x.rstrip((['!','='])))
            except TypeError:
                print('TypeError thrown appropriately for '
                      'str.rstrip() with non-str argument')

            # Dict passed as argument (error)
            x = 'Bee '
            try:
                print(x.rstrip({}))
            except TypeError:
                print('TypeError thrown appropriately for '
                      'str.rstrip() with non-str argument')

            # Multiple arguments passed (error)
            x = 'Bee !=-*'
            try:
                print(x.rstrip('!','='))
            except TypeError:
                print('TypeError thrown appropriately for '
                      'str.rstrip() with multiple arguments')

            print('done.')
            """)

    def test_strip(self):
        self.assertCodeExecution("""
            # No argument passed, strip whitespace only
            x = ' Bee '
            print(x.strip())

            # No argument passed,string contains leading/trailing whitespaces as well as whitespace in between text
            x = ' Bee Ware '
            print(x.lstrip())

            # No argument passed, strip mixed types of whicespaces
            x = '\\n \\t\\r Bee\\n \\t\\r '
            print(x.strip())

            # No arguments passed, no spaces to be stripped
            x = 'Bee'
            print(x.strip())

            # One character string passed as argument to be stripped
            x = '!!! Bee !!'
            print(x.strip('!'))

            # Multiple character string passed as argument to be stripped
            x = '!=-* Bee !=-*'
            print(x.strip('*-=!'))

            # No argument passed, strip whitespace only, with only leading whitespace
            x = ' Bee'
            print(x.strip())

            # No argument passed, strip leading mixed types of whicespaces
            x = '\\n \\t\\r Bee'
            print(x.strip())

            # One character string passed as argument to be stripped, occurring on the left
            x = '!!! Bee'
            print(x.strip('!'))

            # Multiple character string passed as argument to be stripped, occurring on the left
            x = '!=-* Bee'
            print(x.strip('*-=!'))

            # Multiple character string passed as argument with only leading whitespace (nothing should get stripped on the left)
            x = ' !=-*Bee!=-*'
            print(x.strip('*-=!'))

            # No argument passed, strip whitespace only, with only trailing whitespace
            x = 'Bee '
            print(x.strip())

            # No argument passed, strip trailing mixed types of whicespaces
            x = 'Bee \\n \\t\\r'
            print(x.strip())

            # One character string passed as argument to be stripped, occurring on the right
            x = 'Bee !!!'
            print(x.strip('!'))

            # Multiple character string passed as argument to be stripped, occurring on the right
            x = 'Bee !=-*'
            print(x.strip('*-=!'))

            # Multiple character string passed as argument with only trailing whitespace (nothing should get stripped on the right)
            x = '!=-*Bee!=-* '
            print(x.strip('*-=!'))

            # Int passed as argument (error)
            x = '111Bee111'
            try:
                print(x.strip(1))
            except TypeError:
                print('TypeError thrown appropriately for '
                      'str.strip() with non-str argument')

            # Tuple passed as argument (error)
            x = '!=-* Bee !=-*'
            try:
                print(x.strip(('!','=')))
            except TypeError:
                print('TypeError thrown appropriately for '
                      'str.strip() with non-str argument')

            # List passed as argument (error)
            x = '!=-*Bee!=-*'
            try:
                print(x.strip((['!','='])))
            except TypeError:
                print('TypeError thrown appropriately for '
                      'str.strip() with non-str argument')

            # Dict passed as argument (error)
            x = ' Bee '
            try:
                print(x.strip({}))
            except TypeError:
                print('TypeError thrown appropriately for '
                      'str.strip() with non-str argument')

            # Multiple arguments passed (error)
            x = '!=-*Bee !=-*'
            try:
                print(x.strip('!','='))
            except TypeError:
                print('TypeError thrown appropriately for '
                      'str.strip() with multiple arguments')

            print('done.')
            """)

    def test_capitalize_no_args(self):
        self.assertCodeExecution("""
        simple_strings = ['aaa', 'AAA', 'AaAaA', 'Aa. Aa. aA.', '1a', '1A']
        unicode_strings = [u'aaa', u'AAA', u'AaAaA', u'Aa. Aa. aA.', u'1a', u'1A']
        raw_strings = [r'aaa', r'AAA', r'AaAaA', r'Aa. AA. aA.', r'1a', r'1A']
        exotic_strings = ['ыы', 'ää', 'ßß', 'ああ', 'ññ']
        strings = unicode_strings + simple_strings + raw_strings + exotic_strings
        for i in strings:
            print(i.capitalize())
        """)

    def test_capitalize_multiple_args(self):
        self.assertCodeExecution("""
        try:
            'x'.capitalize(1)
        except TypeError as err:
            print(err)
        else:
            print('No exception for str.capitalize() with multiple arguments')
        """)

    def test_isalpha(self):
        self.assertCodeExecution("""
        for i in range(32, 128):
            print(i, chr(i).isalpha())
        """)

    def test_isdigit(self):
        self.assertCodeExecution("""
        for i in range(32, 128):
            print(i, chr(i).isdigit())
        """)

    def test_split(self):
        self.assertCodeExecution("""
        print("abc".split())
        print("abc abc abc".split())
        print("a".split(","))
        print("a,b".split(","))
        print("a,b,c".split(","))
        print(",,,".split(","))
        """)

    def test_index(self):
        self.assertCodeExecution("""
        print("abca".index("a", 0))
        print("abca".index("a", 1))
        print("abc".index("a"))
        print("abc".index("b"))
        print("abc".index("c"))
        print("abc".index("bc"))
        print("abc".index("d"))
        """)

    def test_contains_escapes_regular_expressions(self):
        self.assertCodeExecution("""
        print('(' not in '(/)')
        """)

class FormatTests(TranspileTestCase):
        alternate = ('#', '')

        length_modifiers = ('h', 'L', 'l', '')

        conversion_flags = ('d', 'i', 'o', 'u', 'x', 'X', 'e', 'E', 'f', 'F',
            'g', 'G', 'r', 's'
        )

        args = ('"s"', '"spam"', '"5"', 5, -5, 5.0, -5.0, 0.5, 0.50, 0.000005,
            0.000000000000000000005, -0.5, -0.000005, -0.000000000000000000005,
            500000, -500000, 500000000000000000000, -500000000000000000000,
            1361129467683753853853498429727072845824,
            1361129467683753853853498429727072845824
        )

        template = """
                print('>>> "format this: %{spec}" % {arg}')
                try:
                    print('format this: %{spec}' % {arg})
                except (ValueError, TypeError, OverflowError) as err:
                    print(err)
                print('Done.')
                """

        @transforms(
            js_bool = False,
            decimal = False,
            float_exp = False,
            memory_ref = False
        )
        def test_basic(self, js_cleaner, py_cleaner):
            combinations = (product(self.alternate, self.conversion_flags, self.args))
            tests = ''.join(
                [
                    adjust(self.template
                            .format(spec = comb[0] + comb[1], arg = comb[2])
                    ) for comb in combinations
                ]
            )

            self.assertCodeExecution(tests, js_cleaner = js_cleaner, py_cleaner = py_cleaner)

        @transforms(
            js_bool = False,
            decimal = False,
            float_exp = False
        )
        def test_c_conversion(self, js_cleaner, py_cleaner):
            """tests for c character conversion
            in C Python there is an upper bound to what int or float can be provided
            and this is platform specific. currently, Batavia is not enforcing any
            kind of upper bound.
            """

            # the smallest representable value (32), a typical value ('d') and
            # two unacceptable types
            values = (32, 100, -1, '"s"', '"spam"')
            tests = ''.join(
                [
                    adjust(self.template
                        .format(
                            spec = 'c', arg = v)
                        ) for v in values
                ]
            )

            self.assertCodeExecution(tests, js_cleaner = js_cleaner, py_cleaner = py_cleaner)

        @transforms(
            js_bool = False,
            decimal = False,
            float_exp = False
        )
        @unittest.expectedFailure
        def test_c_conversion_bad(self, js_cleaner, py_cleaner):
            """tests for c character conversion
            tests for values between 1-31 can't be properly represented
            """
            values = (1, 31)

            tests = ''.join(
                [
                    adjust(self.template
                        .format(spec = 'c', arg = v)
                    ) for v in values
                ]
            )

            self.assertCodeExecution(tests, js_cleaner = js_cleaner, py_cleaner = py_cleaner)

        @transforms(
            js_bool = False,
            decimal = False,
            float_exp = False,
            memory_ref = False
        )
        def test_field_width(self, js_cleaner, py_cleaner):
            cases = (('2s', '"s"'), ('2s', '"spam"'), ('2d', 5), ('2d', 1234),
                ('5d', 0.5),
            )

            tests = ''.join(
                [
                    adjust(self.template
                        .format(spec = ''.join(c[0]), arg = c[1])
                    ) for c in cases
                ]
            )

            self.assertCodeExecution(tests, js_cleaner = js_cleaner, py_cleaner = py_cleaner)

        @transforms(
            js_bool = False,
            decimal = False,
            float_exp = False,
            memory_ref = False
        )
        def test_precision(self, js_cleaner, py_cleaner):
            precisions = ('.5', '.21')

            cases = (('d', 3), ('i', 3), ('o', 3), ('u', 3), ('x', 3), ('X', 3),
                ('e', 3), ('E', 3), ('f', 3.5), ('F', 3.5), ('g', 3), ('G', 3),
                ('c', 35), ('r', '"s"'), ('s', '"s"')
            )

            combinations = product(precisions, cases)
            tests = ''.join(
                [
                    adjust(self.template
                        .format(spec = c[0] + c[1][0], arg = c[1][1]
                        )
                    ) for c in combinations
                ]
            )

            self.assertCodeExecution(tests, js_cleaner = js_cleaner, py_cleaner = py_cleaner)

        @transforms(
            js_bool = False,
            decimal = False,
            float_exp = False,
            memory_ref = False
        )
        def test_left_adjust(self, js_cleaner, py_cleaner):
            """conversion flags for - and 0"""

            flags = ('-', '0')

            cases = (('3d', 3), ('3i', 3), ('3o', 3), ('3u', 3), ('3x', 3),
                ('3X', 3), ('10.1e', 3), ('10.1E', 3), ('10.1f', 3.5),
                ('10.1F', 3.5), ('10.1g', 3), ('10.1G', 3), ('3c', 3),
                ('3r', '"s"'), ('3s', '"s"')
            )

            combinations = product(flags, cases)
            tests = ''.join(
                [
                    adjust(self.template
                        .format(spec = c[0] + c[1][0], arg = c[1][1]
                        )
                    ) for c in combinations
                ]
            )

            self.assertCodeExecution(tests, js_cleaner = js_cleaner, py_cleaner = py_cleaner)

        @transforms(
            js_bool = False,
            decimal = False,
            float_exp = False,
            memory_ref = False
        )
        def test_plus_sign(self, js_cleaner, py_cleaner):
            flags = ('+', ' ')

            cases = (('d', 3), ('d', -3), ('i', 3), ('i', -3), ('o', 3),
                ('o', -3), ('u', 3), ('u', -3), ('x', 3), ('x', -3), ('X', 3),
                ('X', -3), ('e', 3), ('e', -3), ('E', 3), ('E', -3), ('f', 3.5),
                ('f', -3.5), ('F', 3.5), ('F', -3.5), ('g', 3), ('g', -3),
                ('G', 3), ('G', -3), ('c', 3), ('r', '"s"'), ('s', '"s"')
            )

            combinations = product(flags, cases)
            tests = ''.join(
                [adjust
                    (self.template
                        .format(spec = c[0] + c[1][0], arg = c[1][1]
                        )
                    ) for c in combinations
                ]
            )

            self.assertCodeExecution(tests, js_cleaner = js_cleaner, py_cleaner = py_cleaner)

        @transforms(
            js_bool = False,
            decimal = False,
            float_exp = False,
            memory_ref = False
        )
        def test_literal_percent(self, js_cleaner, py_cleaner):
            test = adjust("""
                print(">>> '%s %%' % 'spam'")
                print('%s %%' % 'spam')
                print(">>> '%%5.5d' % 5")
                print('%%5.5d' % 5)
                print(">>> '%s %% %s' % ('spam', 'beans')")
                print('%s %% %s' % ('spam', 'beans'))
                """)

            self.assertCodeExecution(test, js_cleaner = js_cleaner, py_cleaner = py_cleaner)

        @transforms(
            js_bool = False,
            decimal = False,
            float_exp = False,
            memory_ref = False
        )
        def test_unrelated_chars(self, js_cleaner, py_cleaner):
            """
            unrelated characters following a specifier
            """

            test = adjust("""
                print(">>> '%s!' % 'spam'")
                print('%s!' % 'spam')
                """)

            self.assertCodeExecution(test, js_cleaner = js_cleaner, py_cleaner = py_cleaner)

        @transforms(
            js_bool = False,
            decimal = False,
            float_exp = False,
            memory_ref = False
        )
        def test_no_args(self, js_cleaner, py_cleaner):
            test = adjust("""
                print(">>> 'nope' % ()")
                try:
                    print('nope' % ())
                except (ValueError, TypeError, OverflowError) as err:
                    print(err)
                print('Done.')
                """)

            self.assertCodeExecution(test, js_cleaner = js_cleaner, py_cleaner = py_cleaner)

        @transforms(
            js_bool = False,
            decimal = False,
            float_exp = False,
            memory_ref = False
        )
        def test_too_many_args(self, js_cleaner, py_cleaner):
            test = adjust("""
                print(">>> 'format this: %d' % (5, 5)")
                try:
                    print('format this: %d' % (5, 5))
                except (ValueError, TypeError, OverflowError) as err:
                    print(err)
                print('Done.')
                """)

            self.assertCodeExecution(test, js_cleaner = js_cleaner, py_cleaner = py_cleaner)

        @transforms(
            js_bool = False,
            decimal = False,
            float_exp = False,
            memory_ref = False
        )
        def test_not_enough_args(self, js_cleaner, py_cleaner):
            test = adjust("""
                print(">>> 'format this: %d %d' % 5")
                try:
                    print('format this: %d %d' % 5)
                except (ValueError, TypeError, OverflowError) as err:
                    print(err)
                print('Done.')
                """)

            self.assertCodeExecution(test, js_cleaner = js_cleaner, py_cleaner = py_cleaner)

        @transforms(
            js_bool = False,
            decimal = False,
            float_exp = False,
            memory_ref = False
        )
        def test_bogus_specifier(self, js_cleaner, py_cleaner):
            test = adjust("""
                print(">>> 'format this: %t' % 5") # not actually a specifier!
                try:
                    print('format this: %t' % 5)
                except (ValueError, TypeError, OverflowError) as err:
                    print(err)
                print('Done.')
                """)

            self.assertCodeExecution(test, js_cleaner = js_cleaner, py_cleaner = py_cleaner)

        @transforms(
            js_bool = False,
            decimal = False,
            float_exp = False,
            memory_ref = False
        )
        def test_with_kwargs(self, js_cleaner, py_cleaner):

            tests = adjust("""
                print(">>> 'format this: %(arg)s' % {'arg':'spam'}")
                print('format this: %(arg)s' % {'arg':'spam'})
                print(">>> 'format this: %(arg)s' % {'arg':'spam', 'arg2':'eggs'}")
                print('format this: %(arg)s' % {'arg':'spam', 'arg2':'eggs'})
                print('Done.')
                """)

            self.assertCodeExecution(tests, js_cleaner = js_cleaner, py_cleaner = py_cleaner)

        @transforms(
            js_bool = False,
            decimal = False,
            float_exp = False,
            memory_ref = False
        )
        def test_with_tuple_of_dicts(self, js_cleaner, py_cleaner):

            tests = adjust("""
                print(">>> 'format this: %(arg)s' % ({'arg':'spam'}, {'arg2':'eggs'})")
                print('format this: %(arg)s' % ({'arg':'spam'}, {'arg2':'eggs'}))
                print('Done.')
                """)

            self.assertCodeExecution(tests, js_cleaner = js_cleaner, py_cleaner = py_cleaner)

        @transforms(
            js_bool = False,
            decimal = False,
            float_exp = False,
            memory_ref = False
        )
        def test_with_kwargs(self, js_cleaner, py_cleaner):

            tests = adjust("""
                print(">>> 'format this: %(arg' % {'arg':'spam'}")
                print('format this: %(arg' % {'arg':'spam'})
                print('Done.')
                """)

            self.assertCodeExecution(tests, js_cleaner = js_cleaner, py_cleaner = py_cleaner)

        @transforms(
            js_bool = False,
            decimal = False,
            float_exp = False,
            memory_ref = False
        )
        def test_wildcard_with_kwargs(self, js_cleaner, py_cleaner):

            tests = adjust("""
                print(">>> '%*(spam)s' % {'spam': 'eggs'}")
                print('%*(spam)s' % {'spam': 'eggs'})
                print('Done.')
                """)

            self.assertCodeExecution(tests, js_cleaner = js_cleaner, py_cleaner = py_cleaner)

        @transforms(
            js_bool = False,
            decimal = False,
            float_exp = False,
            memory_ref = False
        )
        def test_kwargs_missing_key(self, js_cleaner, py_cleaner):

            tests = adjust("""
                print(">>> 'format this: %(beans)s' % {'spam':'eggs'}")
                print('format this: %(beans)s' % {'spam':'eggs'})
                print(">>> 'format this: %(1)s' % {'spam':'eggs'}")
                print('format this: %(1)s' % {'spam':'eggs'})
                print('Done.')
                """)

            self.assertCodeExecution(tests, js_cleaner = js_cleaner, py_cleaner = py_cleaner)

class NewStyleFormatTests(TranspileTestCase):
    """
    many tests borrowed from the Brython test suite
    """

    # tests for grabbing arguments

    def test_single(self):
        test_str = adjust("""
        print(">>> 'one arg: {}'.format('great!')")
        print('one arg: {}'.format('great!'))
        """)

        self.assertCodeExecution(test_str)

    def test_single_called_twice(self):
        # should raise an index error
        test_str = adjust("""
        print(">>> 'one arg: {} {} great!'.format('really')")
        print('one arg: {} {} great!'.format('really'))
        """)

        self.assertCodeExecution(test_str)

    def test_by_index(self):
        test_str = adjust("""
        print(">>> 'Some numbers: {0} {1} {2}'.format('one', 'two', 'three')")
        print('Some numbers: {0} {1} {2}'.format('one', 'two', 'three'))
        print(">>> 'Some numbers: {0} {0} {0}'.format('one', 'two', 'three')")
        print('Some numbers: {0} {0} {0}'.format('one', 'two', 'three'))
        """)

        self.assertCodeExecution(test_str)

    def test_index_out_of_range(self):
        test_str = adjust("""
        print(">>> 'Some numbers: {0} {1} {5}'.format('one', 'two', 'three')")
        print('Some numbers: {0} {1} {5}'.format('one', 'two', 'three'))
        """)

        self.assertCodeExecution(test_str)

    def test_kwargs(self):
        test_str = adjust("""
        print(">>> '{food}! Lovely {food}! Lovely {food}!'.format(food='spam', other='eggs')")
        print('{food}! Lovely {food}! Lovely {food}!'.format(food='spam', other='eggs'))
        """)

        self.assertCodeExecution(test_str)

    def test_kwargs_key_error(self):
        test_str = adjust("""
        print(">>> '{food}! Lovely {food}! Lovely {food}!'.format(other='eggs')")
        print('{food}! Lovely {food}! Lovely {food}!'.format(other='eggs'))
        """)

        self.assertCodeExecution(test_str)

    def test_kwargs_by_splat(self):
        test_str = adjust("""
        coord = {'latitude': '37.24N', 'longitude': '-115.81W'}
        print(">>> 'Coordinates: {latitude}, {longitude}'.format(**coord)")
        print('Coordinates: {latitude}, {longitude}'.format(**coord))
        """)
        self.assertCodeExecution(test_str)

    def test_name_with__getitem__(self):
        """
        name calls __getitem__ on argument
        """

        test_str = adjust("""
        coord = (3, 5)
        print(">>> 'X: {0[0]};  Y: {0[1]}'.format(coord)")
        print('X: {0[0]};  Y: {0[1]}'.format(coord))
        """)
        self.assertCodeExecution(test_str)

    def test___getitem__bad_formatting(self):
        """
        tests for sad paths with getitem
        """

        test_str = adjust("""
        coord = (3, 5)
        print(">>> 'X: {0[]}}'.format(coord)")
        print('X: {0[]}'.format(coord))
        print(">>> 'X: {0[}}'.format(coord)")
        print('X: {0[}'.format(coord))
        """)
        self.assertCodeExecution(test_str)

    def test_name_with__getattr__(self):
        """
        name calls attribute on passed argument
        """


        test_str = adjust("""
        class Actor():
            name = 'John Cleese'

        print(">>> '{a.name}'.format(a=Actor())")
        print('{a.name}'.format(a=Actor())')
        """)

    def test__getattr__bad_formatting(self):
        """
        tests using a dot operator with nothing after it
        """
        test_str = adjust("""

        print(">>> '{food.}'.format(food='spam')")
        print('{food.}'.format(food='spam'))
        """)
    # conversion flags
    def test_conversion_flags(self):
        conversion_flags = ('!a', '!s', '!r', '!', '!ss', '!g')

        test_str = ''.join(
            [
                adjust(
                    """
                    print(">>> 'one arg: {{{flag}:}}'.format('great')")
                    print('one arg: {{{flag}:}}'.format('great'))
                    """.format(flag=flag)
                ) for flag in conversion_flags
            ]
        )

        self.assertCodeExecution(test_str)

    def test_fills(self):
        fills = ('*', '**', '{', '}') # only one character, no curly braces
        test_str = ''.join(
            [
                adjust(
                    """
                    print(">>> 'one arg: {{:{fill}<10}}'.format('great')")
                    print('one arg: {{:{fill}<10}}'.format('great'))
                    """.format(fill=fill)
                ) for fill in fills
            ]
        )

        self.assertCodeExecution(test_str)

    def test_alignments(self):
        alignments = ['<', '^', '>', '=']
        test_str = ''.join(
            [
                adjust(
                    """
                    print(">>> 'one arg: {{:{align}10}}'.format('spam')")
                    print('one arg: {{:{align}10}}'.format('spam'))
                    print(">>> 'one arg: {{:*{align}10}}'.format('spam')")
                    print('one arg: {{:*{align}10}}'.format('spam'))
                    """.format(align=align)
                ) for align in alignments
            ]
        )

        self.assertCodeExecution(test_str)

    def test_fill_no_alignment(self):

        test_str = adjust("""
        print(">>> 'one arg: {:*10}'.format('great')")
        print('one arg: {:*10}'.format('great'))
        """)

        self.assertCodeExecution(test_str)

    def test_signs(self):
        signs = ('+', '-', ' ')
        numbers = (5, -5)

        combinations = product(signs, numbers)
        test_str = ''.join(
            [
                adjust(
                    """
                    print(">>> 'one arg:: {{:{sign}}}'.format({num})")
                    print('one arg:: {{:{sign}}}'.format({num}))
                    """.format(sign=sign, num=num)
                ) for sign, num in combinations
            ]
        )

        self.assertCodeExecution(test_str)

    def test_signs_with_str(self):
        """
        signs with strings shouldn't be allowed
        """

        test_str = adjust("""
        print(">>> 'one arg: {:+}'.format('great')")
        print('one arg: {:+}'.format('great'))
        """)

        self.assertCodeExecution(test_str)

    @transforms(decimal = False,)
    def test_groupings(self, js_cleaner, py_cleaner):
        groupings = (',', '_')
        test_str = ''.join(
            [
                adjust(
                    """
                    print(">>> 'one arg:: {{:{g}}}'.format(5000)")
                    print('one arg:: {{:{g}}}'.format(5000))
                    """.format(g=g)
                ) for g in groupings
            ]
        )

        self.assertCodeExecution(test_str, js_cleaner=js_cleaner,
                                    py_cleaner=py_cleaner)

    def test_groupings_with_str(self):
        """
        grouping with str shouldn't be allowed
        """

        test_str = adjust("""
        print(">>> 'one arg: {:,}'.format('great')")
        print('one arg: {:,}'.format('great'))
        """)

        self.assertCodeExecution(test_str)

    def test_zero_padding(self):

        test_str = adjust("""
        print(">>> 'one arg: {:05}'.format(5)")
        print('one arg: {:05}'.format(5))
        print(">>> 'one arg: {:05}'.format('spam')")
        print('one arg: {:05}'.format('spam'))
        """)

        self.assertCodeExecution(test_str)

    def test_conversion_types(self):
        """
        test all conversion types and their alternate forms
        """
        alternate = ('#', '')
        types = ('b', 'c', 'd', 'e', 'E', 'f', 'F', 'g', 'G', 'n', 'o', 's', 'x', 'X',
                '%')
        args = ("'spam'", "'5'", 5, -5, 5.0, -5.0, 0.5, -0.5)
        combinations = product(alternate, types, args)
        test_str = ''.join(
            [
                adjust(
                    """
                    print(">>> 'one arg: {{:{alter}{typ}}}'.format({arg})")
                    print('one arg: {{:{alter}{typ}}}'.format({arg}))
                    """.format(alter=alter, typ=typ, arg=arg)
                ) for alter, typ, arg in combinations
            ]
        )

        self.assertCodeExecution(test_str)

    def test_precisions(self):
        precisions = ('.1', '.5')
        test_str = ''.join(
            [
                adjust(
                    """
                    print(">>> 'one arg: {{:{p}}}'.format(5.123456789)")
                    print('one arg: {{:{p}}}'.format(5.123456789))
                    """.format(p=p)
                ) for p in precisions
            ]
        )

        self.assertCodeExecution(test_str)

    def test_no_args(self):
        test_str = adjust("""
        print(">>> 'one arg: {}'.format()")
        print('one arg: {}'.format())
        """)

    def test_random_types(self):

        args = (values[0] for _type, values in SAMPLE_DATA.items())

        test_str = ''.join(
            [
                adjust(
                    """
                    print('''>>> 'one arg: {{}}'.format({arg})''')
                    print('''one arg: {{}}'''.format({arg}))
                    """.format(arg=arg)
                ) for arg in args
            ]
        )

        self.assertCodeExecution(test_str)


class UnaryStrOperationTests(UnaryOperationTestCase, TranspileTestCase):
    data_type = 'str'


class BinaryStrOperationTests(BinaryOperationTestCase, TranspileTestCase):
    data_type = 'str'


class InplaceStrOperationTests(InplaceOperationTestCase, TranspileTestCase):
    data_type = 'str'
