from ..utils import TranspileTestCase, BuiltinFunctionTestCase


class DirTests(TranspileTestCase):
    pass


class BuiltinDirFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "dir"

    not_implemented = [
        'test_class',
    ]


class BuiltinDirTypeFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    """Test suite that ensures that dir(x) returns the correct type."""
    function = "lambda x: type(dir(x))"

    not_implemented = [
        'test_class',
    ]
