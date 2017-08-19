from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class PropertyTests(TranspileTestCase):
    pass


class BuiltinPropertyFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "property"
