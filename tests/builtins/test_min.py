import re

from .. utils import TranspileTestCase, BuiltinFunctionTestCase
from .. utils import SAMPLE_SUBSTITUTIONS

class MinTests(TranspileTestCase):
    pass


class BuiltinMinFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    functions = ["min"]
    substitutions = SAMPLE_SUBSTITUTIONS.copy()
    substitutions.update({
        # Set/Frozenset ordering can be different in cPython and Batavia
        # This means we get TypeErrors on different types when finding min value
        # in sets composed from different types
        "<class 'TypeError'>": [
            re.compile(r"unorderable types: .* < .*"),
        ]
    })

    def test_default_kwarg(self):
        self.assertCodeExecution("""
            print(min([], default=123))
            print(min([], default="empty"))
            print(min([1, 2, 3], default="empty"))
            """)
