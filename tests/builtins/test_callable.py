from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class CallableTests(TranspileTestCase):
    pass


class BuiltinCallableFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["callable"]

    not_implemented = [
        'test_bytearray',
        'test_class',
        'test_complex',
        'test_frozenset',
    ]
