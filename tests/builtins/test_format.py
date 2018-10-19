from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class FormatTests(TranspileTestCase):
    pass


class BuiltinFormatFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "format"
