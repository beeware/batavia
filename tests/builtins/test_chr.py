from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class ChrTests(TranspileTestCase):
    pass

class BuiltinChrFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "chr"
