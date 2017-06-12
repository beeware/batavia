from ..utils import TranspileTestCase, ModuleFunctionTestCase


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

    not_implemented = [
        'test_json_JSONEncoder().encode_str',    # TODO ensure ascii
        'test_json_JSONEncoder().encode_dict',   # fails due to dict ordering
        'test_json_JSONEncoder().encode_class',  # fails due to class __str__
    ]


JSONEncoderTests.add_one_arg_tests('json', ['JSONEncoder().encode'])


class DumpsTests(ModuleFunctionTestCase, TranspileTestCase):

    not_implemented = [
        'test_json_dumps_str',             # TODO ensure ascii
        'test_json_dumps_dict',            # fails due to dict ordering
        'test_json_dumps_class',           # fails due to class __str__
    ]

DumpsTests.add_one_arg_tests('json', ['dumps'])
