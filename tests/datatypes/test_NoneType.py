from .. utils import TranspileTestCase, UnaryOperationTestCase, BinaryOperationTestCase, InplaceOperationTestCase


class NoneTypeTests(TranspileTestCase):
    def test_setattr(self):
        self.assertCodeExecution("""
            x = None
            x.thing = 42
            print('Done.')
            """)

    def test_getattr(self):
        self.assertCodeExecution("""
            x = None
            y = x.thing
            print('Done.')
            """)


class UnaryNoneTypeOperationTests(UnaryOperationTestCase, TranspileTestCase):
    data_type = 'None'


class BinaryNoneTypeOperationTests(BinaryOperationTestCase, TranspileTestCase):
    data_type = 'None'

    not_implemented = [
    ]


class InplaceNoneTypeOperationTests(InplaceOperationTestCase, TranspileTestCase):
    data_type = 'None'

    not_implemented = [
    ]
