from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class ComplexTests(TranspileTestCase):
    pass


class BuiltinComplexFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["complex"]
