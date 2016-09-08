from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class TupleTests(TranspileTestCase):
    def test_type_float(self):
        self.assertCodeExecution("print(type((0, 1.2, 3)[1]))")



class BuiltinTupleFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["tuple"]

    not_implemented = [
        'test_bytearray',
        'test_bytes',
        'test_complex',
        'test_dict',
        'test_NotImplemented',
        'test_range',
        'test_set',
    ]
