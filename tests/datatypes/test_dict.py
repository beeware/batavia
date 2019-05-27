from ..utils import TranspileTestCase, UnaryOperationTestCase, BinaryOperationTestCase, InplaceOperationTestCase, \
    MagicMethodFunctionTestCase

import unittest


class DictTests(TranspileTestCase):

    @unittest.expectedFailure
    def test_setattr(self):
        self.assertCodeExecution("""
            x = {}
            try:
                x.attr = 42
            except AttributeError as e:
                print(e)
            print('Done.')
            """)

    def test_getattr(self):
        self.assertCodeExecution("""
            x = {}
            try:
                print(x.attr)
            except AttributeError as e:
                print(e)
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

        subst = {
            'str() < int()': ['int() < str()'],
            "'str' and 'int'": ["'int' and 'str'"],
        }

        # keys with the same string representation
        self.assertCodeExecution("""
            x = {1: 2, '1': 1}
            try:
                print(sorted(x.items()))
            except TypeError as e:
                print(e)
            print('Done.')
        """, substitutions=subst)

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
            try:
                print(x['c'])
            except KeyError as e:
                print(e)
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
            try:
                x = dict([('a', 1), ('b', 2, False)])
            except ValueError as e:
                print(e)
            print('Done.')
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
            try:
                x = dict([('a', 1), False, ('b', 2)])
            except TypeError as e:
                print(e)
            print('Done.')
            """, run_in_function=False)

    def test_pop_success(self):

        self.assertCodeExecution("""
            d = {'a': 1}
            print(d.pop('b', 2), d)
        """)

        self.assertCodeExecution("""
            d = {'a': 1}
            print(d.pop('a'), d)
        """)

    def test_pop_fail(self):

        self.assertCodeExecution("""
            d = {'a': 1}
            try:
                d.pop('b')
            except KeyError as e:
                print(e)
            print('Done')
        """)

        self.assertCodeExecution("""
            d = {}
            try:
                d.pop(1, 2, 3)
            except TypeError as e:
                print(e)
            print('Done.')
        """)

    def test_popitem_success(self):

        self.assertCodeExecution("""
            d = {'c': 3}
            print(d.popitem(), d)
        """)

        self.assertCodeExecution("""
            d = {'a': 1, 'b': 2, 'c': 3, 'd': 4}
            l = [d.popitem(), d.popitem(), d.popitem(), d.popitem()]
            l.sort()
            print(d, l)
        """)

    def test_popitem_fail(self):

        self.assertCodeExecution("""
            d = {}
            try:
                d.popitem(1)
            except TypeError as e:
                print(e)
            print('Done.')
        """)

        self.assertCodeExecution("""
            d = {}
            try:
                d.popitem()
            except KeyError as e:
                print(e)
            print('Done.')
        """)

    def test_setdefault_success(self):

        self.assertCodeExecution("""
            d = {}
            print(d.setdefault('a', 1), d)
        """)

        self.assertCodeExecution("""
            d = {'x': 24}
            print(d.setdefault('a'), d == {'x': 24, 'a': None})
        """)

    def test_setdefault_fail(self):

        self.assertCodeExecution("""
            d = {}
            try:
                d.setdefault()
            except TypeError as e:
                print(e)
            print('Done.')
        """)

    def test_fromkeys_success(self):

        self.assertCodeExecution("""
            d = {}
            print(d.fromkeys(['a', 'a'], 1))
        """)

        self.assertCodeExecution("""
            d = {}
            print(d.fromkeys(['a', 'b', 'c'], 3) == {'a': 3, 'b': 3, 'c': 3})
        """)

    def test_fromkeys_fail(self):

        self.assertCodeExecution("""
            d = {}
            try:
                print(d.fromkeys([], None, None))
            except TypeError as e:
                print(e)
            print('Done.')
        """)

    def test_len(self):
        self.assertCodeExecution("""
        print(len(dict()))
        print(type(len(dict())))
        print(len({1: 2}))
        """)


class MagicMethodFunctionTests(MagicMethodFunctionTestCase, TranspileTestCase):
    data_type = 'dict'
    MagicMethodFunctionTestCase._add_tests(vars(), dict)


class UnaryDictOperationTests(UnaryOperationTestCase, TranspileTestCase):
    data_type = 'dict'


class BinaryDictOperationTests(BinaryOperationTestCase, TranspileTestCase):
    data_type = 'dict'

    not_implemented = [
        'test_subscr_class',
        'test_subscr_NotImplemented',

        # Incorrect error message shown (unsupported operands vs can't multiply sequence by non-int)
        "test_multiply_bytearray",
        "test_multiply_bytes",
    ]


class InplaceDictOperationTests(InplaceOperationTestCase, TranspileTestCase):
    data_type = 'dict'

    not_implemented = [
        # Incorrect error message shown (unsupported operands vs can't multiply sequence by non-int)
        "test_multiply_bytes",
        "test_multiply_list",
        "test_multiply_str",
        "test_multiply_tuple",
    ]
