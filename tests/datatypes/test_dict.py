from .. utils import TranspileTestCase, UnaryOperationTestCase, BinaryOperationTestCase, InplaceOperationTestCase

import unittest


class DictTests(TranspileTestCase):
    @unittest.expectedFailure
    def test_setattr(self):
        self.assertCodeExecution("""
            x = {}
            x.attr = 42
            print('Done.')
            """)

    def test_getattr(self):
        self.assertCodeExecution("""
            x = {}
            print(x.attr)
            print('Done.')
            """)

    def test_creation(self):
        # Empty dict
        self.assertCodeExecution("""
            x = {}
            print(x)
            """)

        # normal key
        self.assertCodeExecution("""
            x = {'a': 1}
            print(x)
            """)

        # keys with the same string representation
        self.assertCodeExecution("""
            x = {1: 2, '1': 1}
            print(sorted(x.items()))
            """, substitutions={'str() < int()': ['int() < str()']})

    def test_getitem(self):
        # Simple existent key
        self.assertCodeExecution("""
            y = 37
            x = {'a': 1, 'b': 2, 'c': y}
            print('a' in x)
            print('a' not in x)
            print(x['a'])
            """)

        # Simple non-existent key
        self.assertCodeExecution("""
            x = {'a': 1, 'b': 2}
            print('c' in x)
            print('c' not in x)
            print(x['c'])
            """, run_in_function=False)

        # Override key
        self.assertCodeExecution("""
            x = {'a': 1}
            print(x)
            x['a'] = 2
            print(x)
            """)

    def test_clear(self):
        # Clear a dictionary
        self.assertCodeExecution("""
            x = {'a': 1, 'b': 2}
            print('a' in x)
            print(x.clear())
            print('a' not in x)
            print(x)
            """)

        # Clear an already empty dict
        self.assertCodeExecution("""
            x = {}
            print('a' not in x)
            print(x.clear())
            print('a' not in x)
            print(x)
            """)

    def test_builtin_constructor(self):
        # Construct a dictionary using the dict builtin
        self.assertCodeExecution("""
            x = dict()
            print(x)
            print('a' in x)

            # List of tuples
            x = dict([('a', 1), ('b', 2)])
            print('a' in x)
            print(x['a'])
            print('c' in x)

            # List of lists
            x = dict([['a', 3], ['b', 4]])
            print('a' in x)
            print(x['a'])
            print('c' in x)

            # Tuple of lists
            x = dict((['a', 5], ['b', 6]))
            print('a' in x)
            print(x['a'])
            print('c' in x)

            # Tuple of tuples
            x = dict((('a', 5), ('b', 6)))
            print('a' in x)
            print(x['a'])
            print('c' in x)
        """)

    def test_builtin_non_2_tuples(self):
        # One of the elements isn't a 2-tuple
        self.assertCodeExecution("""
            x = dict([('a', 1), ('b', 2, False)])
            """, run_in_function=False)

    def test_print_dict(self):
        """
        Primarily useful to assert that dict is able to be printed
        since bytecode has changed for dict creation between 3.4 and 3.5
        """
        self.assertCodeExecution("""
            foo = {'a': 1}
            print(foo)
            """)

    def test_print_dict_bytecode_34(self):
        # equivalent to
        #   foo = {'a': 1}
        #   print(foo)
        # we are using explicit bytecode here so that we can test
        # differences in Python bytecode between diff Py versions
        # within a single test suite
        bytecode = (
            b'7gwNCsmyUFcaAAAA4wAAAAAAAAAAAAAAAAMAAABAAAAAcxsAAABpAQBkAABkAQA2WgAAZQEAZQAA\n'
            b'gwEAAWQCAFMpA+kBAAAA2gFhTikC2gNmb2/aBXByaW50qQByBQAAAHIFAAAA+gd0ZXN0LnB52gg8\n'
            b'bW9kdWxlPgEAAABzAgAAAA0B\n'
        )
        expected = "{'a': 1}\n"
        self.assertJavaScriptExecution(bytecode, expected, js={})

    def test_print_dict_bytecode_35(self):
        # equivalent to
        #   foo = {'a': 1}
        #   print(foo)
        # we are using explicit bytecode here so that we can test
        # differences in Python bytecode between diff Py versions
        # within a single test suite
        bytecode = (
            b'Fg0NChCzUFcaAAAA4wAAAAAAAAAAAAAAAAIAAABAAAAAcxoAAABkAABkAQBpAQBaAABlAQBlAACD\n'
            b'AQABZAIAUykD2gFh6QEAAABOKQLaA2Zvb9oFcHJpbnSpAHIFAAAAcgUAAAD6B3Rlc3QucHnaCDxt\n'
            b'b2R1bGU+AQAAAHMCAAAADAE=\n'
        )
        expected = "{'a': 1}\n"
        self.assertJavaScriptExecution(bytecode, expected, js={})

    def test_builtin_non_sequence(self):
        # One of the elements isn't a sequence
        self.assertCodeExecution("""
            x = dict([('a', 1), False, ('b', 2)])
            """, run_in_function=False)

class UnaryDictOperationTests(UnaryOperationTestCase, TranspileTestCase):
    data_type = 'dict'


class BinaryDictOperationTests(BinaryOperationTestCase, TranspileTestCase):
    data_type = 'dict'

    not_implemented = [
        'test_multiply_class',

        'test_subscr_class',
        'test_subscr_NotImplemented'
    ]


class InplaceDictOperationTests(InplaceOperationTestCase, TranspileTestCase):
    data_type = 'dict'

    not_implemented = []
