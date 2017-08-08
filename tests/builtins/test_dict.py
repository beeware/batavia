from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class DictTests(TranspileTestCase):
    pass


class BuiltinDictFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["dict"]

    not_implemented = [
        'test_bytearray',
        'test_bytes',
        'test_frozenset',
        'test_range',
        'test_set',
        'test_str',
    ]

    def test_well_formatted_set(self):
        self.assertCodeExecution("""
            good_set = {(1, 2), (2, 3)}
            print(dict(good_set))
            """)
