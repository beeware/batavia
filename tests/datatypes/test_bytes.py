from ..utils import TranspileTestCase, UnaryOperationTestCase, \
    BinaryOperationTestCase, InplaceOperationTestCase, MagicMethodFunctionTestCase

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


class MagicMethodFunctionTests(MagicMethodFunctionTestCase, TranspileTestCase):
    data_type = 'bytes'
    MagicMethodFunctionTestCase._add_tests(vars(), bytes)

    not_implemented = [
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
        "test__mod__bool": ['3.5', '3.6'],
        "test__mod__bytearray": ['3.5', '3.6'],
        "test__mod__bytes": ['3.5', '3.6'],
        "test__mod__class": ['3.5', '3.6'],
        "test__mod__complex": ['3.5', '3.6'],
        "test__mod__dict": ['3.5', '3.6'],
        "test__mod__float": ['3.5', '3.6'],
        "test__mod__frozenset": ['3.5', '3.6'],
        "test__mod__int": ['3.5', '3.6'],
        "test__mod__list": ['3.5', '3.6'],
        "test__mod__None": ['3.5', '3.6'],
        "test__mod__NotImplemented": ['3.5', '3.6'],
        "test__mod__range": ['3.5', '3.6'],
        "test__mod__set": ['3.5', '3.6'],
        "test__mod__slice": ['3.5', '3.6'],
        "test__mod__str": ['3.5', '3.6'],
        "test__mod__tuple": ['3.5', '3.6'],

        "test__rmod__missing": ['3.4'],
    }


class UnaryBytesOperationTests(UnaryOperationTestCase, TranspileTestCase):
    data_type = 'bytes'


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
        'test_modulo_None': ['3.5', '3.6'],
        'test_modulo_NotImplemented': ['3.5', '3.6'],
        'test_modulo_bool': ['3.5', '3.6'],
        'test_modulo_bytearray': ['3.5', '3.6'],
        'test_modulo_bytes': ['3.5', '3.6'],
        'test_modulo_class': ['3.5', '3.6'],
        'test_modulo_complex': ['3.5', '3.6'],
        'test_modulo_dict': ['3.5', '3.6'],
        'test_modulo_float': ['3.5', '3.6'],
        'test_modulo_frozenset': ['3.5', '3.6'],
        'test_modulo_int': ['3.5', '3.6'],
        'test_modulo_list': ['3.5', '3.6'],
        'test_modulo_range': ['3.5', '3.6'],
        'test_modulo_set': ['3.5', '3.6'],
        'test_modulo_slice': ['3.5', '3.6'],
        'test_modulo_str': ['3.5', '3.6'],
        'test_modulo_tuple': ['3.5', '3.6'],
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
    ]


class InplaceBytesOperationTests(InplaceOperationTestCase, TranspileTestCase):
    data_type = 'bytes'

    not_implemented_versions = {
        'test_modulo_None': ['3.5', '3.6'],
        'test_modulo_NotImplemented': ['3.5', '3.6'],
        'test_modulo_bool': ['3.5', '3.6'],
        'test_modulo_bytearray': ['3.5', '3.6'],
        'test_modulo_bytes': ['3.5', '3.6'],
        'test_modulo_class': ['3.5', '3.6'],
        'test_modulo_complex': ['3.5', '3.6'],
        'test_modulo_dict': ['3.5', '3.6'],
        'test_modulo_float': ['3.5', '3.6'],
        'test_modulo_frozenset': ['3.5', '3.6'],
        'test_modulo_int': ['3.5', '3.6'],
        'test_modulo_list': ['3.5', '3.6'],
        'test_modulo_range': ['3.5', '3.6'],
        'test_modulo_set': ['3.5', '3.6'],
        'test_modulo_slice': ['3.5', '3.6'],
        'test_modulo_str': ['3.5', '3.6'],
        'test_modulo_tuple': ['3.5', '3.6'],
    }
