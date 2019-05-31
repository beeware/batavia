from ..utils import TranspileTestCase, UnaryOperationTestCase, \
    BinaryOperationTestCase, InplaceOperationTestCase, MagicMethodFunctionTestCase

import unittest


class BytesTests(TranspileTestCase):
    @unittest.expectedFailure
    def test_setattr(self):
        self.assertCodeExecution("""
            x = b'hello, world'
            try:
                x.attr = 42
            except AttributeError as e:
                print(e)
            print('Done.')
            """)

    def test_getattr(self):
        self.assertCodeExecution("""
            x = b'hello, world'
            try:
                print(x.attr)
            except AttributeError as e:
                print(e)
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


class MagicMethodFunctionTests(MagicMethodFunctionTestCase, TranspileTestCase):
    data_type = 'bytes'
    MagicMethodFunctionTestCase._add_tests(vars(), bytes)

    not_implemented = [
        "test__mod__bool",
        "test__mod__bytearray",
        "test__mod__bytes",
        "test__mod__class",
        "test__mod__complex",
        "test__mod__dict",
        "test__mod__float",
        "test__mod__frozenset",
        "test__mod__int",
        "test__mod__list",
        "test__mod__None",
        "test__mod__NotImplemented",
        "test__mod__range",
        "test__mod__set",
        "test__mod__slice",
        "test__mod__str",
        "test__mod__tuple",
        "test__mul__bytearray",
        "test__mul__bytes",
        "test__mul__class",
        "test__mul__complex",
        "test__mul__dict",
        "test__mul__float",
        "test__mul__frozenset",
        "test__mul__list",
        "test__mul__None",
        "test__mul__NotImplemented",
        "test__mul__range",
        "test__mul__set",
        "test__mul__slice",
        "test__mul__str",
        "test__mul__tuple",

        "test__rmod__bytes",
    ]

    not_implemented_versions = {
    }


class UnaryBytesOperationTests(UnaryOperationTestCase, TranspileTestCase):
    data_type = 'bytes'


class BinaryBytesOperationTests(BinaryOperationTestCase, TranspileTestCase):
    data_type = 'bytes'

    not_implemented_versions = {
    }

    not_implemented = [
        'test_modulo_None',
        'test_modulo_NotImplemented',
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
        'test_modulo_range',
        'test_modulo_set',
        'test_modulo_slice',
        'test_modulo_str',
        'test_modulo_tuple',

        'test_eq_bytearray',

        'test_ge_bytearray',

        'test_gt_bytearray',

        'test_lt_bytearray',

        'test_le_bytearray',

        'test_ne_bytearray',

        'test_subscr_bool',
        'test_subscr_int',
        'test_subscr_slice',
    ]


class InplaceBytesOperationTests(InplaceOperationTestCase, TranspileTestCase):
    data_type = 'bytes'

    not_implemented_versions = {
    }

    not_implemented = [
        'test_modulo_None',
        'test_modulo_NotImplemented',
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
        'test_modulo_range',
        'test_modulo_set',
        'test_modulo_slice',
        'test_modulo_str',
        'test_modulo_tuple',
    ]
