from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class TypeTests(TranspileTestCase):
    pass


class BuiltinTypeFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["type"]

    not_implemented = [
        'test_class',
        'test_frozenset',
    ]
