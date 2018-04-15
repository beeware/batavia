from .. utils import TranspileTestCase, UnaryOperationTestCase, BinaryOperationTestCase, InplaceOperationTestCase

import unittest


class BytesTests(TranspileTestCase):
    @unittest.expectedFailure
    def test_setattr(self):
        self.assertCodeExecution("""
            x = b'hello, world'
            x.attr = 42
            print('Done.')
            """)

    def test_getattr(self):
        self.assertCodeExecution("""
            x = b'hello, world'
            print(x.attr)
            print('Done.')
            """)

    def test_init(self):
        self.assertCodeExecution("""
            x = bytes("Ramón de España", 'utf-8')
            print(x)
            """)

        self.assertCodeExecution("""
            x = bytes("Ramón de España", 'latin-1')
            print(x)
            """)

        self.assertCodeExecution("""
            x = bytes("Clive James", 'ascii')
            print(x)
            """)

    @unittest.expectedFailure
    def test_init_encode_error(self):
        # test with accents can't be encoded with ascii,
        # should raise UnicodeEncodeError
        self.assertCodeExecution("""
            x = bytes("Ramón de España", 'ascii')
            print(x)
            """)

    def test_equality_properly(self):
        # testing something against itself not enough for buffer.Buffer
        # we need two separate values which are equivalent
        # see http://paste.ubuntu.com/23358563/
        self.assertCodeExecution("""
            utf8_ints = bytes([82, 97, 109, 195, 179, 110, 32, 100, 101, 32,
                               69, 115, 112, 97, 195, 177, 97])
            utf8_string = bytes("Ramón de España", "utf-8")
            print(utf8_ints)
            print(utf8_string)
            print(utf8_ints == utf8_string)
            """)

    def test_decode(self):
        self.assertCodeExecution("""
            print("Encoded with utf-8")
            x = bytes([82, 97, 109, 195, 179, 110, 32, 100, 101, 32, 69, 115, 112, 97, 195, 177, 97])
            print(x.decode('utf-8'))
            """)

        self.assertCodeExecution("""
            print("Encoded with iso-latin1")
            x = bytes([82, 97, 109, 243, 110, 32, 100, 101, 32, 69, 115, 112, 97, 241, 97])
            print(x.decode('latin-1'))
            """)

        self.assertCodeExecution("""
            print("Encoded with ascii")
            x = b'Clive James'
            print(x.decode('ascii'))
            """)

    @unittest.expectedFailure
    def test_decode_error(self):
        self.assertCodeExecution("""
            # encoded with utf_8
            x = bytes([82, 97, 109, 195, 179, 110, 32, 100, 101, 32, 69, 115, 112, 97, 195, 177, 97])
            print(x.decode('ascii'))
            """)

        self.assertCodeExecution("""
            // encoded with latin_1
            x = bytes([82, 97, 109, 243, 110, 32, 100, 101, 32, 69, 115, 112, 97, 241, 97])
            print(x.decode('utf-8'))
            """)

class UnaryBytesOperationTests(UnaryOperationTestCase, TranspileTestCase):
    data_type = 'bytes'

    not_implemented = []


class BinaryBytesOperationTests(BinaryOperationTestCase, TranspileTestCase):
    data_type = 'bytes'

    not_implemented_versions = {
        'test_subscr_bytearray': ['3.4'],
        'test_subscr_bytes': ['3.4'],
        'test_subscr_class': ['3.4'],
        'test_subscr_complex': ['3.4'],
        'test_subscr_dict': ['3.4'],
        'test_subscr_float': ['3.4'],
        'test_subscr_frozenset': ['3.4'],
        'test_subscr_list': ['3.4'],
        'test_subscr_None': ['3.4'],
        'test_subscr_NotImplemented': ['3.4'],
        'test_subscr_range': ['3.4'],
        'test_subscr_set': ['3.4'],
        'test_subscr_str': ['3.4'],
        'test_subscr_tuple': ['3.4'],
    }

    not_implemented = [
        'test_eq_bytearray',

        'test_ge_bytearray',

        'test_gt_bytearray',

        'test_lt_bytearray',

        'test_le_bytearray',

        'test_ne_bytearray',

        'test_subscr_bool',
        'test_subscr_int',
        'test_subscr_slice',
        'test_subscr_str',
        'test_subscr_tuple',
    ]


class InplaceBytesOperationTests(InplaceOperationTestCase, TranspileTestCase):
    data_type = 'bytes'

    not_implemented = [
        'test_lshift_bool',
        'test_lshift_bytearray',
        'test_lshift_bytes',
        'test_lshift_class',
        'test_lshift_complex',
        'test_lshift_dict',
        'test_lshift_float',
        'test_lshift_frozenset',
        'test_lshift_int',
        'test_lshift_list',
        'test_lshift_None',
        'test_lshift_NotImplemented',
        'test_lshift_range',
        'test_lshift_set',
        'test_lshift_slice',
        'test_lshift_str',
        'test_lshift_tuple',

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

        'test_multiply_bool',
        'test_multiply_bytearray',
        'test_multiply_bytes',
        'test_multiply_class',
        'test_multiply_complex',
        'test_multiply_None',
        'test_multiply_NotImplemented',
        'test_multiply_class'
        'test_multiply_complex',
        'test_multiply_dict',
        'test_multiply_float',
        'test_multiply_frozenset',
        'test_multiply_int',
        'test_multiply_list',
        'test_multiply_range',
        'test_multiply_set',
        'test_multiply_slice',
        'test_multiply_str',
        'test_multiply_tuple',


        'test_or_bool',
        'test_or_bytearray',
        'test_or_bytes',
        'test_or_class',
        'test_or_complex',
        'test_or_dict',
        'test_or_float',
        'test_or_frozenset',
        'test_or_int',
        'test_or_list',
        'test_or_None',
        'test_or_NotImplemented',
        'test_or_range',
        'test_or_set',
        'test_or_slice',
        'test_or_str',
        'test_or_tuple',

        'test_power_bool',
        'test_power_bytearray',
        'test_power_bytes',
        'test_power_class',
        'test_power_complex',
        'test_power_dict',
        'test_power_float',
        'test_power_frozenset',
        'test_power_int',
        'test_power_list',
        'test_power_None',
        'test_power_NotImplemented',
        'test_power_range',
        'test_power_set',
        'test_power_slice',
        'test_power_str',
        'test_power_tuple',

        'test_rshift_bool',
        'test_rshift_bytearray',
        'test_rshift_bytes',
        'test_rshift_class',
        'test_rshift_complex',
        'test_rshift_dict',
        'test_rshift_float',
        'test_rshift_frozenset',
        'test_rshift_int',
        'test_rshift_list',
        'test_rshift_None',
        'test_rshift_NotImplemented',
        'test_rshift_range',
        'test_rshift_set',
        'test_rshift_slice',
        'test_rshift_str',
        'test_rshift_tuple',

        'test_subtract_bool',
        'test_subtract_bytearray',
        'test_subtract_bytes',
        'test_subtract_class',
        'test_subtract_complex',
        'test_subtract_dict',
        'test_subtract_float',
        'test_subtract_frozenset',
        'test_subtract_int',
        'test_subtract_list',
        'test_subtract_None',
        'test_subtract_NotImplemented',
        'test_subtract_range',
        'test_subtract_set',
        'test_subtract_slice',
        'test_subtract_str',
        'test_subtract_tuple',

        'test_true_divide_bool',
        'test_true_divide_bytearray',
        'test_true_divide_bytes',
        'test_true_divide_class',
        'test_true_divide_complex',
        'test_true_divide_dict',
        'test_true_divide_float',
        'test_true_divide_frozenset',
        'test_true_divide_int',
        'test_true_divide_list',
        'test_true_divide_None',
        'test_true_divide_NotImplemented',
        'test_true_divide_range',
        'test_true_divide_set',
        'test_true_divide_slice',
        'test_true_divide_str',
        'test_true_divide_tuple',

        'test_xor_bool',
        'test_xor_bytearray',
        'test_xor_bytes',
        'test_xor_class',
        'test_xor_complex',
        'test_xor_dict',
        'test_xor_float',
        'test_xor_frozenset',
        'test_xor_int',
        'test_xor_list',
        'test_xor_None',
        'test_xor_NotImplemented',
        'test_xor_range',
        'test_xor_set',
        'test_xor_slice',
        'test_xor_str',
        'test_xor_tuple',
    ]
