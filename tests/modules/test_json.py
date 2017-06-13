from ..utils import TranspileTestCase, ModuleFunctionTestCase

import unittest


class JSONEncoderTests(ModuleFunctionTestCase, TranspileTestCase):

    def test_encode_type(self):
        self.assertCodeExecution("""
            import json
            enc = json.JSONEncoder()
            print(type(enc.encode("str")))
            print(type(enc.encode({})))
            print(type(enc.encode([])))
            print(type(enc.encode(1)))
            print(type(enc.encode(1.5)))
            print(type(enc.encode((4, 2))))
            print(type(enc.encode(None)))
            print(type(enc.encode(True)))
        """)

    def test_illegal_dict_key(self):
        self.assertCodeExecution("""
            import json

            d = { object(): 1, 'k': 'v' }
            try:
                json.JSONEncoder().encode(d)
            except TypeError as e:
                print(e)
        """)

    def test_skipkeys(self):
        self.assertCodeExecution("""
            import json

            d = { object(): 1, 'k': 'v' }
            print(json.JSONEncoder(skipkeys=True).encode(d))
        """)

    def test_out_of_range_float(self):
        self.assertCodeExecution("""
            import json

            print(json.JSONEncoder().encode(
                [float('nan'), float('inf'), float('-inf')]
            ))
        """)

    def test_separators(self):
        self.assertCodeExecution("""
            import json

            print(json.JSONEncoder(separators=('#', '$')).encode([1, {2: 3}]))
        """)

    def test_indent_num(self):
        self.assertCodeExecution("""
            import json

            enc = json.JSONEncoder(indent=2)
            print(enc.encode([1, 2, [3, [4, 5]], 6]))
            print(enc.encode({1: [2, 3, {4: {5: 6}}]}))
        """)

    def test_indent_str(self):
        self.assertCodeExecution("""
            import json

            enc = json.JSONEncoder(indent='$')
            print(enc.encode([1, 2, [3, [4, 5]], 6]))
            print(enc.encode({1: [2, 3, {4: {5: 6}}]}))
        """)

    @unittest.expectedFailure
    def test_sort_keys(self):
        self.assertCodeExecution("""
            import json

            enc = json.JSONEncoder(sort_keys=True)
            print(enc.encode({9: 8, 2: 1, 7: {6: 5, 4: 3}}))
        """)

    not_implemented = [
        'test_json_JSONEncoder().encode_str',    # TODO ensure ascii
        'test_json_JSONEncoder().encode_dict',   # fails due to dict ordering
        'test_json_JSONEncoder().encode_class',  # fails due to class __str__
    ]


JSONEncoderTests.add_one_arg_tests('json', ['JSONEncoder().encode'])


class DumpsTests(ModuleFunctionTestCase, TranspileTestCase):

    not_implemented = [
        'test_json_dumps_str',    # TODO ensure ascii
        'test_json_dumps_dict',   # fails due to dict ordering
        'test_json_dumps_class',  # fails due to class __str__
    ]

DumpsTests.add_one_arg_tests('json', ['dumps'])
