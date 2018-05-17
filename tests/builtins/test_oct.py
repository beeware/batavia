from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class OctTests(TranspileTestCase):
    pass


class BuiltinOctFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "oct"
