from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class VarsTests(TranspileTestCase):
    pass


class BuiltinVarsFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "vars"

    not_implemented = [
        "test_class",  # This will fail as long as <type> is missing __dict__
    ]
