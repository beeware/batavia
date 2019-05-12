from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class BytearrayTests(TranspileTestCase):
    pass


class BuiltinBytearrayFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "bytearray"

    not_implemented_versions = {
        'test_dict': ['3.6'],
        'test_frozenset': ['3.6'],
        'test_list': ['3.6'],
        'test_set': ['3.6'],
        'test_tuple': ['3.6'],
    }
