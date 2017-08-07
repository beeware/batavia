from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class SetTests(TranspileTestCase):
    pass


class BuiltinSetFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["set"]

    assert_output_as_python = ['test_str', 'test_dict']
    not_implemented = [
        'test_bool',
        'test_bytearray',
        'test_bytes',
        'test_range',
        'test_tuple',
    ]
