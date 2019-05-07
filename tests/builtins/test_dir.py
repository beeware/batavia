from ..utils import TranspileTestCase, BuiltinFunctionTestCase


class DirTests(TranspileTestCase):
    pass


class BuiltinDirFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "dir"

    not_implemented_versions = {
        'test_None': ['3.6'],
        'test_NotImplemented': ['3.6'],
        'test_bool': ['3.6'],
        'test_bytearray': ['3.5', '3.6'],
        'test_bytes': ['3.5', '3.6'],
        'test_complex': ['3.6'],
        'test_dict': ['3.6'],
        'test_float': ['3.6'],
        'test_frozenset': ['3.6'],
        'test_int': ['3.6'],
        'test_list': ['3.6'],
        'test_noargs': ['3.6'],
        'test_range': ['3.5', '3.6'],
        'test_set': ['3.6'],
        'test_slice': ['3.6'],
        'test_str': ['3.6'],
        'test_tuple': ['3.6'],
    }

    not_implemented = [
        'test_class',
    ]
