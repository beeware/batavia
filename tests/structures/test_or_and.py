from ..utils import TranspileTestCase


class OrTests(TranspileTestCase):
    def test_simple(self):
        self.assertCodeExecution("""
            print(False or 'yes')
        """)

    def test_truth_value_testing(self):
        self.assertCodeExecution("""
            print(None or 'yes')
        """)


class AndTests(TranspileTestCase):
    def test_simple(self):
        self.assertCodeExecution("""
            print(True and 'yes')
        """)

    def test_truth_value_testing(self):
        self.assertCodeExecution("""
            print(None and 'yes')
        """)
