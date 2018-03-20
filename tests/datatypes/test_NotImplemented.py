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
        'test_unary_not',
    ]


class BinaryNotImplementedOperationTests(BinaryOperationTestCase, TranspileTestCase):
    data_type = 'NotImplemented'

    not_implemented = [

        'test_floor_divide_complex',

        'test_modulo_complex',

        'test_subscr_bool',
        'test_subscr_bytearray',
        'test_subscr_bytes',
        'test_subscr_class',
        'test_subscr_complex',
        'test_subscr_dict',
        'test_subscr_float',
        'test_subscr_frozenset',
        'test_subscr_int',
        'test_subscr_list',
        'test_subscr_None',
        'test_subscr_NotImplemented',
        'test_subscr_range',
        'test_subscr_set',
        'test_subscr_slice',
        'test_subscr_str',
        'test_subscr_tuple',
    ]


class InplaceNotImplementedOperationTests(InplaceOperationTestCase, TranspileTestCase):
    data_type = 'NotImplemented'

    not_implemented = [

        'test_floor_divide_complex',

        'test_modulo_complex',
    ]
