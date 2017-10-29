from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class BytearrayTests(TranspileTestCase):
    pass


class BuiltinBytearrayFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "bytearray"

    not_implemented = [
        'test_noargs',
        'test_int',
        'test_list',
        'test_range',
        'test_str',
        'test_tuple',
    ]
