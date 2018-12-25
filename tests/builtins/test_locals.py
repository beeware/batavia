from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class LocalsTests(TranspileTestCase):
    pass


class BuiltinLocalsFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "locals"

    not_implemented = [
    ]
