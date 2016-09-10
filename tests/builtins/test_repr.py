from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class ReprTests(TranspileTestCase):
    pass


class BuiltinReprFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["repr"]

    not_implemented = [
        'test_class',
        'test_NotImplemented',
        'test_range',
        'test_slice',
    ]
