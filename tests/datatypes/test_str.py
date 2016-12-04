from .. utils import TranspileTestCase, UnaryOperationTestCase, BinaryOperationTestCase, InplaceOperationTestCase

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

    field_widths = (
        '5',
        '-5',
        ''
    )

    percisions = (
        '5',
        '-5',
        ''
    )

    length_modifiers = (
        'h',
        'L',
        'l',
        ''
    )

    converstion_flags = (
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
        's',
        '%'  # literal %
    )

    args = (
        'spam',
        5,
        -5,
        5.0,
        -5.0,
        '5',
        0o12,
        -0o12,
        0x12,
        -0x12,
        0X12,
        -0X12,
        10e5,
        -10e5,
        10E5,
        -10E5
    )

    template = 'format this: %{}'

    specifiers = []

    for fw in field_widths:
        for p in percisions:
            for l in length_modifiers:
                for cf in converstion_flags:
                    specifiers.append("%{fw}{p}{l}{cf}".format(fw=fw, p=p, l=l, cf=cf))

    def test_basic(self):
        pass

    def test_with_mapping_key(self):
        pass

    def test_with_arbitrary_field_width(self):
        pass

    def test_with_arbitrary_precision(self):
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
