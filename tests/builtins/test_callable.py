from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class CallableTests(TranspileTestCase):
    pass


class BuiltinCallableFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["callable"]

    not_implemented = [
        'test_class',
        'test_frozenset',
    ]
