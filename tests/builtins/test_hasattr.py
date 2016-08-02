from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class HasattrTests(TranspileTestCase):
    pass


class BuiltinHasattrFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["hasattr"]

    not_implemented = [
        'test_frozenset',
        'test_None',
    ]
