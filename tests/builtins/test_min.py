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
        # This means we get TypeErrors on different types when finding max value
        # in sets composed from different types
        "<class 'TypeError'>": [
            re.compile(r"unorderable types: .* < .*"),
        ]
    })

    not_implemented = [
        'test_bytearray'
    ]
