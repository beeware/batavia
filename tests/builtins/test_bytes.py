import re

from .. utils import TranspileTestCase, BuiltinFunctionTestCase
from .. utils import SAMPLE_SUBSTITUTIONS


class BytesTests(TranspileTestCase):
    pass


class BuiltinBytesFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "bytes"
    small_ints = True
    substitutions = SAMPLE_SUBSTITUTIONS.copy()
    substitutions.update({
        # Set/Frozenset ordering can be different in cPython and Batavia
        # This means we get TypeErrors on different types when initialising
        # bytes objects from sets of floats and strs.
        "<class 'TypeError'>": [
            re.compile(r"'.*' object cannot be interpreted as an integer"),
        ]
    })
