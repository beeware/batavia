from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class IsinstanceTests(TranspileTestCase):
    pass


class BuiltinIsinstanceFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["isinstance"]

    not_implemented = [
        'test_frozenset',
    ]
