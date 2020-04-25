from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class StaticmethodTests(TranspileTestCase):
    pass


class BuiltinStaticmethodFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "staticmethod"
