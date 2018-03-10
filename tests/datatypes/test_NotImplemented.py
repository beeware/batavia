from .. utils import TranspileTestCase, UnaryOperationTestCase, BinaryOperationTestCase, InplaceOperationTestCase


class NotImplementedTests(TranspileTestCase):
    def test_truth(self):
        self.assertCodeExecution("""
            x = NotImplemented
            print(x == True)
            """)


class UnaryNotImplementedOperationTests(UnaryOperationTestCase, TranspileTestCase):
    data_type = 'NotImplemented'

    not_implemented = [
        'test_unary_positive',
        'test_unary_negative',
        'test_unary_invert',
        'test_unary_not',
    ]


class BinaryNotImplementedOperationTests(BinaryOperationTestCase, TranspileTestCase):
    data_type = 'NotImplemented'

    not_implemented = [

        'test_floor_divide_complex',

        'test_modulo_complex',
    ]


class InplaceNotImplementedOperationTests(InplaceOperationTestCase, TranspileTestCase):
    data_type = 'NotImplemented'

    not_implemented = [

        'test_floor_divide_complex',

        'test_modulo_complex',
    ]
