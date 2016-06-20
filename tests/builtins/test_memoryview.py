from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class MemoryviewTests(TranspileTestCase):
    pass


class BuiltinMemoryviewFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["memoryview"]

    not_implemented = [
        'test_bool',
        'test_bytearray',
        'test_bytes',
        'test_class',
        'test_complex',
        'test_dict',
        'test_float',
        'test_frozenset',
        'test_int',
        'test_list',
        'test_None',
        'test_NotImplemented',
        'test_range',
        'test_set',
        'test_slice',
        'test_str',
        'test_tuple',
    ]
