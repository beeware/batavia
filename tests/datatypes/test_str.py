from .. utils import TranspileTestCase, UnaryOperationTestCase, BinaryOperationTestCase, InplaceOperationTestCase, \
    adjust

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

    alternate = ('#', '')

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
        'c',
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
        0.000005,
        0.000000000000000000005,
        -0.5,
        -0.000005,
        -0.000000000000000000005,
        500000,
        -500000,
        500000000000000000000,
        -500000000000000000000
    )


    def test_basic(self):

        combinations = (product(self.alternate, self.length_modifiers, self.conversion_flags, self.args))
        tests = ''.join([adjust("""
                print('>>> format this: %{spec} % {arg}')
                print('format this: %{spec}' % {arg})
                """.format(
                    spec=''.join(comb[0:2]), arg=comb[3])) for comb in combinations])

        self.assertCodeExecution(tests)

    def test_with_mapping_key(self):
        # TODO
        pass

    def test_field_width(self):

        cases = (
            ('%2s', 's'),
            ('%2s', 'spam'),
            ('%2d', 5),
            ('%2d', 1234),
        )

        tests = ''.join([adjust("""
            print('>>> format this: %{spec} % {arg}')
            print('format this: %{spec}' % {arg})
            """.format(
            spec=''.join(c[0]), arg=c[1])) for c in cases])

        self.assertCodeExecution(tests)

    def test_precision(self):

        cases = (
            ('%.5d', 3),
            ('%.5i', 3),
            ('%.5o', 3),
            ('%.5u', 3),
            ('%.5x', 3),
            ('%.5X', 3),
            ('%.5e', 3),
            ('%.5E', 3),
            ('%.5f', 3),
            ('%.5F', 3),
            ('%.5g', 3),
            ('%.5G', 3),
            ('%.5c', 3),
            ('%.5r', 's'),
            ('%.5s', 's')
        )
        
        tests = ''.join([adjust("""
            print('>>> format this: %{spec} % {arg}')
            print('format this: %{spec}' % {arg})
            """.format(
            spec=''.join(c[0]), arg=c[1])) for c in cases])

        self.assertCodeExecution(tests)
    def test_zero_padded(self):
        pass

    def test_left_adjust(self):
        pass

    def test_blank_pad(self):
        pass

    def test_plus_sign(self):
        pass

    def test_literal_percent(self):
        pass

class UnaryStrOperationTests(UnaryOperationTestCase, TranspileTestCase):
    data_type = 'str'



class BinaryStrOperationTests(BinaryOperationTestCase, TranspileTestCase):
    data_type = 'str'

    not_implemented = [
        'test_modulo_bytearray',
        'test_modulo_class',
        'test_modulo_None',
        'test_modulo_NotImplemented',
        'test_modulo_range',
        'test_modulo_slice',
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
