from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class ClassmethodTests(TranspileTestCase):
    pass


class BuiltinClassmethodFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "classmethod"
