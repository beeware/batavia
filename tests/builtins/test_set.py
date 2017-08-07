from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class SetTests(TranspileTestCase):
    pass


class BuiltinSetFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["set"]

    assert_output_as_python = ['test_str']
    not_implemented = [
        'test_bool',
        'test_bytearray',
        'test_bytes',
        'test_dict',
        'test_range',
        'test_tuple',
    ]
