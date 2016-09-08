from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class ComplexTests(TranspileTestCase):
    pass


class BuiltinComplexFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["complex"]

    not_implemented = [
        # this works, but printing is broken for floats in some tricky cases
        'test_int',
    ]
