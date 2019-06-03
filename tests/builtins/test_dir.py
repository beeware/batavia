from ..utils import TranspileTestCase, BuiltinFunctionTestCase


class DirTests(TranspileTestCase):
    pass


class BuiltinDirFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "dir"

    not_implemented_versions = {
        'test_noargs': ['3.6'],
    }

    not_implemented = [
        'test_class',
    ]
