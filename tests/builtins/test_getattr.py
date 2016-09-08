from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class GetattrTests(TranspileTestCase):
    pass


class BuiltinGetattrFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["getattr"]

    not_implemented = [
        'test_None',
    ]
