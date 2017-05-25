from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class BytearrayTests(TranspileTestCase):
    pass


class BuiltinBytearrayFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["bytearray"]
    small_ints = True

    not_implemented = [
        # 'test_bytearray',
        # 'test_class',
        # 'test_complex',
        # 'test_dict',
        # 'test_float',
        # 'test_frozenset',
        # 'test_int',
        # 'test_list',
        # 'test_None',
        # 'test_NotImplemented',
        # 'test_range',
        # 'test_set',
        # 'test_slice',
        # 'test_str',
        # 'test_tuple',
    ]
