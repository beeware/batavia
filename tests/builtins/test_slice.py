from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class SliceTests(TranspileTestCase):
    pass


class BuiltinSliceFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["slice"]

    not_implemented = [
        'test_class',
        'test_NotImplemented',
    ]
