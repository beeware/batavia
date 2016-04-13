import unittest

from ..utils import TranspileTestCase


class SequenceTests(TranspileTestCase):
    def test_unpack_sequence(self):
        self.assertCodeExecution("""
            x = [1, 2, 3]
            a, b, c = x
            print(a)
            print(b)
            print(c)
            """)

    @unittest.expectedFailure
    def test_unpack_sequence_overflow(self):
        self.assertCodeExecution("""
            x = [1, 2, 3]
            a, b = x
            print(a)
            print(b)
            """)

    @unittest.expectedFailure
    def test_unpack_sequence_underflow(self):
        self.assertCodeExecution("""
            x = [1, 2]
            a, b, c = x
            print(a)
            print(b)
            print(c)
            """)
