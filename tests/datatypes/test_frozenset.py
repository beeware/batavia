from .. utils import TranspileTestCase, UnaryOperationTestCase, BinaryOperationTestCase


class FrozensetTests(TranspileTestCase):
    def test_creation(self):
        self.assertCodeExecution("""
            x = frozenset([1, 1, '1', '1'])
            print(x)
            """, substitutions={"{1, '1'}": ["{'1', 1}"]})

    def test_len(self):
        self.assertCodeExecution("""
        print(len(frozenset()))
        print(type(len(frozenset())))
        print(len(frozenset([1, 2])))
        """)


class UnaryFrozensetOperationTests(UnaryOperationTestCase, TranspileTestCase):
    data_type = 'frozenset'


class BinaryFrozensetOperationTests(BinaryOperationTestCase, TranspileTestCase):
    data_type = 'frozenset'
