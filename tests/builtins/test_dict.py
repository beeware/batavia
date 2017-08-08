from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class DictTests(TranspileTestCase):
    pass


class BuiltinDictFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "dict"

    not_implemented = [
        'test_bytearray',
        'test_bytes',
        'test_class',
        'test_complex',
        'test_float',
        'test_frozenset',
        'test_None',
        'test_NotImplemented',
        'test_range',
        'test_set',
        'test_slice',
        'test_str',
    ]

    def test_well_formatted_set(self):
        self.assertCodeExecution("""
            good_set = {(1, 2), (2, 3)}
            print(dict(good_set))
            """)
