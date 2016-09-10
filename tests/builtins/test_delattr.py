from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class DelattrTests(TranspileTestCase):
    pass


class BuiltinDelattrFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["delattr"]

    not_implemented = [
        'test_None',
    ]
