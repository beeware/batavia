from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class DirTests(TranspileTestCase):
    pass


class BuiltinDirFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "dir"
