from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class CompileTests(TranspileTestCase):
    pass


class BuiltinCompileFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "compile"
