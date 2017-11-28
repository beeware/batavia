from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class CallableTests(TranspileTestCase):
    pass


class BuiltinCallableFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "callable"
