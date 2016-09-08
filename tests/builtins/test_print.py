from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class PrintTests(TranspileTestCase):
    pass


class BuiltinPrintFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["print"]

    not_implemented = [
        'test_class',
        'test_NotImplemented',
        'test_range',
        'test_slice',
    ]
