from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class SetattrTests(TranspileTestCase):
    pass


class BuiltinSetattrFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["setattr"]

    not_implemented = [
        'test_bytearray',
        'test_class',
        'test_complex',
        'test_dict',
        'test_frozenset',
        'test_set'
    ]
