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
            if 'BeeWare' startswith(''):
                print('BeeWare starts with an empty string')
            else:
                print('BeeWare does not start with an empty string')
            # Invalid type
            if 'BeeWare' startswith(5):
                print('BeeWare starts with the number 5')
            else:
                print('BeeWare does not start with the number 5')
            print('done.')
        """)



class UnaryStrOperationTests(UnaryOperationTestCase, TranspileTestCase):
    data_type = 'str'



class BinaryStrOperationTests(BinaryOperationTestCase, TranspileTestCase):
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
