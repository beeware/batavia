from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class IsinstanceTests(TranspileTestCase):
    pass


class BuiltinIsinstanceFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "isinstance"
