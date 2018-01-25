from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class EvalTests(TranspileTestCase):
    pass


class BuiltinEvalFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "eval"

    not_implemented = [
        'test_bytearray',
        'test_bytes',
        'test_str',
    ]
