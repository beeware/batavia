from .. utils import TranspileTestCase, UnaryOperationTestCase, BinaryOperationTestCase, InplaceOperationTestCase, \
    adjust, transforms

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

    @unittest.expectedFailure
    def test_startswith_no_args(self):
        self.assertCodeExecution("""
            try:
                'BeeWare'.startswith()
            except TypeError as err:
                print(err)
            else:
                print('No exception for ommitted arguments')
         """)

    @unittest.expectedFailure
    def test_startswith_multiple_args(self):
        self.assertCodeExecution("""
            try:
                'BeeWare'.startswith('B', 'e')
            except TypeError as err:
                print(err)
            else:
                print('No exception for multiple arguments')
         """)

    @unittest.expectedFailure
    def test_startswith_tuple(self):
        self.assertCodeExecution("""
            try:
                assert 'BeeWare'.startswith(('e', 'B'))
            except AssertionError:
                print('BeeWare does not start with e or B')
            else:
                print('BeeWare starts with either e or B')
         """)

class FormatTests(TranspileTestCase):

        alternate = ('#',
                     ''
         )

        length_modifiers = (
            'h',
            'L',
            'l',
            ''
        )

        conversion_flags = (
            'd',
            'i',
            'o',
            'u',
            'x',
            'X',
            'e',
            'E',
            'f',
            'F',
            'g',
            'G',
            'r',
            's'
        )

        args = (
            '"s"',
            '"spam"',
            '"5"',
            5,
            -5,
            5.0,
            -5.0,
            0.5,
            0.50,
            0.000005,
            0.000000000000000000005,
            -0.5,
            -0.000005,
            -0.000000000000000000005,
            500000,
            -500000,
            500000000000000000000,
            -500000000000000000000,
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
            js_bool=False,
            decimal=False,
            float_exp=False,
            memory_ref=False
        )
        def test_basic(self, js_cleaner, py_cleaner):
            combinations = (product(self.alternate, self.conversion_flags, self.args))
            tests = ''.join([adjust(
                self.template
                    .format(
                    spec=comb[0] + comb[1], arg=comb[2])
            ) for comb in combinations]
                            )

            self.assertCodeExecution(tests, js_cleaner=js_cleaner, py_cleaner=py_cleaner)

        @transforms(
            js_bool=False,
            decimal=False,
            float_exp=False
        )
        def test_c_conversion(self, js_cleaner, py_cleaner):
            """tests for c character conversion
            in C Python there is an upper bound to what int or float can be provided
            and this is platform specific. currently, Batavia is not enforcing any
            kind of upper bound.
            """
            values = [
                32,
                100,
                -1,
                '"s"',
                '"spam"'
            ]
            tests = ''.join([adjust("""
                    print('>>> "format this: %c" % {arg}')
                    try:
                        print('format this: %c' % {arg})
                    except (ValueError, TypeError, OverflowError) as err:
                        print(err)
                    print('Done.')
                    """.format(
                arg=v)) for v in values])

            self.assertCodeExecution(tests, js_cleaner=js_cleaner, py_cleaner=py_cleaner)

        @transforms(
            js_bool=False,
            decimal=False,
            float_exp=False
        )
        @unittest.expectedFailure
        def test_c_conversion_bad(self, js_cleaner, py_cleaner):
            """tests for c character conversion
            tests for values between 1-31 can't be properly represented
            """
            values = [
                1,
                31
            ]
            tests = ''.join([adjust("""
                    print('>>> "format this: %c" % {arg}')
                    try:
                        print('format this: %c' % {arg})
                    except (ValueError, TypeError, OverflowError) as err:
                        print(err)
                    print('Done.')
                    """.format(
                arg=v)) for v in values])

            self.assertCodeExecution(tests, js_cleaner=js_cleaner, py_cleaner=py_cleaner)

        @transforms(
            js_bool=False,
            decimal=False,
            float_exp=False,
            memory_ref=False
        )
        def test_field_width(self, js_cleaner, py_cleaner):
            cases = (
                ('2s', '"s"'),
                ('2s', '"spam"'),
                ('2d', 5),
                ('2d', 1234),
                ('5d', 0.5),
            )

            tests = ''.join([adjust(self.template
                .format(
                spec=''.join(c[0]), arg=c[1])
            ) for c in cases]
                            )

            self.assertCodeExecution(tests, js_cleaner=js_cleaner, py_cleaner=py_cleaner)

        @transforms(
            js_bool=False,
            decimal=False,
            float_exp=False,
            memory_ref=False
        )
        def test_precision(self, js_cleaner, py_cleaner):
            percisions = ('.5', '.21')

            cases = (
                ('d', 3),
                ('i', 3),
                ('o', 3),
                ('u', 3),
                ('x', 3),
                ('X', 3),
                ('e', 3),
                ('E', 3),
                ('f', 3.5),
                ('F', 3.5),
                ('g', 3),
                ('G', 3),
                ('c', 35),
                ('r', '"s"'),
                ('s', '"s"')
            )

            combinations = product(percisions, cases)
            tests = ''.join([adjust(self.template
                .format(
                spec=c[0] + c[1][0], arg=c[1][1]
            )
            ) for c in combinations])

            self.assertCodeExecution(tests, js_cleaner=js_cleaner, py_cleaner=py_cleaner)

        @transforms(
            js_bool=False,
            decimal=False,
            float_exp=False,
            memory_ref=False
        )
        def test_left_adjust(self, js_cleaner, py_cleaner):
            """conversion flags for - and 0"""

            flags = ('-', '0')

            cases = (

                ('3d', 3),
                ('3i', 3),
                ('3o', 3),
                ('3u', 3),
                ('3x', 3),
                ('3X', 3),
                ('10.1e', 3),
                ('10.1E', 3),
                ('10.1f', 3.5),
                ('10.1F', 3.5),
                ('10.1g', 3),
                ('10.1G', 3),
                ('3c', 3),
                ('3r', '"s"'),
                ('3s', '"s"')
            )

            combinations = product(flags, cases)
            tests = ''.join([adjust(self.template
                .format(
                spec=c[0] + c[1][0], arg=c[1][1]
            )
            ) for c in combinations])

            self.assertCodeExecution(tests, js_cleaner=js_cleaner, py_cleaner=py_cleaner)

        @transforms(
            js_bool=False,
            decimal=False,
            float_exp=False,
            memory_ref=False
        )
        def test_plus_sign(self, js_cleaner, py_cleaner):
            flags = ('+', ' ')

            cases = (

                ('d', 3),
                ('d', -3),
                ('i', 3),
                ('i', -3),
                ('o', 3),
                ('o', -3),
                ('u', 3),
                ('u', -3),
                ('x', 3),
                ('x', -3),
                ('X', 3),
                ('X', -3),
                ('e', 3),
                ('e', -3),
                ('E', 3),
                ('E', -3),
                ('f', 3.5),
                ('f', -3.5),
                ('F', 3.5),
                ('F', -3.5),
                ('g', 3),
                ('g', -3),
                ('G', 3),
                ('G', -3),
                ('c', 3),
                ('r', '"s"'),
                ('s', '"s"')
            )

            combinations = product(flags, cases)
            tests = ''.join([adjust(self.template
                .format(
                spec=c[0] + c[1][0], arg=c[1][1]
            )
            ) for c in combinations])

            self.assertCodeExecution(tests, js_cleaner=js_cleaner, py_cleaner=py_cleaner)

        @transforms(
            js_bool=False,
            decimal=False,
            float_exp=False,
            memory_ref=False
        )
        def test_literal_percent(self, js_cleaner, py_cleaner):
            test = adjust("""
                print(">>> '%s %%' % 'spam'")
                print('%s %%' % 'spam')
                """)

            self.assertCodeExecution(test, js_cleaner=js_cleaner, py_cleaner=py_cleaner)

        @transforms(
            js_bool=False,
            decimal=False,
            float_exp=False,
            memory_ref=False
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

            self.assertCodeExecution(test, js_cleaner=js_cleaner, py_cleaner=py_cleaner)

        @transforms(
            js_bool=False,
            decimal=False,
            float_exp=False,
            memory_ref=False
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

            self.assertCodeExecution(test, js_cleaner=js_cleaner, py_cleaner=py_cleaner)

        @transforms(
            js_bool=False,
            decimal=False,
            float_exp=False,
            memory_ref=False
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

            self.assertCodeExecution(test, js_cleaner=js_cleaner, py_cleaner=py_cleaner)

        @transforms(
            js_bool=False,
            decimal=False,
            float_exp=False,
            memory_ref=False
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

            self.assertCodeExecution(test, js_cleaner=js_cleaner, py_cleaner=py_cleaner)


class UnaryStrOperationTests(UnaryOperationTestCase, TranspileTestCase):
    data_type = 'str'



class BinaryStrOperationTests(BinaryOperationTestCase, TranspileTestCase):
    data_type = 'str'

    not_implemented = [
        'test_modulo_class', # TODO, need to represent a class' namespace if needed
        'test_modulo_frozenset', # TODO, don't know how to ensure order
        'test_modulo_set',  # TODO, don't know how to ensure order
        'test_modulo_slice'

    ]


class InplaceStrOperationTests(InplaceOperationTestCase, TranspileTestCase):
    data_type = 'str'

    not_implemented = [
        'test_modulo_bool',
        'test_modulo_bytearray',
        'test_modulo_bytes',
        'test_modulo_class',
        'test_modulo_complex',
        'test_modulo_dict',
        'test_modulo_float',
        'test_modulo_frozenset',
        'test_modulo_int',
        'test_modulo_list',
        'test_modulo_None',
        'test_modulo_NotImplemented',
        'test_modulo_range',
        'test_modulo_set',
        'test_modulo_slice',
        'test_modulo_str',
        'test_modulo_tuple',
    ]
