import re

from .. utils import TranspileTestCase, BuiltinFunctionTestCase
from .. utils import SAMPLE_SUBSTITUTIONS


class MaxTests(TranspileTestCase):
    pass


class BuiltinMaxFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "max"
    substitutions = SAMPLE_SUBSTITUTIONS.copy()
    substitutions.update({
        # Set/Frozenset ordering can be different in cPython and Batavia
        # This means we get TypeErrors on different types when finding max value
        # in sets composed from different types
        "<class 'TypeError'>": [
            re.compile(r"unorderable types: .* > .*"),
        ]
    })

    def test_default_kwarg(self):
        self.assertCodeExecution("""
            print(max([], default=123))
            print(max([], default="empty"))
            print(max([1, 2, 3], default="empty"))
            """)
