from .. utils import TranspileTestCase, BuiltinFunctionTestCase


class DictTests(TranspileTestCase):
    pass


class BuiltinDictFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "dict"

    # these are implemented, but the exact exception thrown depends on the order
    # that they are iterated on being the exact same in both CPython and batavia,
    # which is not guaranteed. (if a string with odd length is the "first" element, it gives
    # a different exception than if an int is the "first" element)
    is_flakey = [
        'test_frozenset',
        'test_set',
    ]

    def test_well_formatted_set(self):
        self.assertCodeExecution("""
            good_set = {(1, 2), (2, 3)}
            print(dict(good_set))
            """)
