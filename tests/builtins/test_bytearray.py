from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class BytearrayTests(TranspileTestCase):
    pass


class BuiltinBytearrayFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "bytearray"
