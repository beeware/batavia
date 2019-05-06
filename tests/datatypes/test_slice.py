from .. utils import TranspileTestCase, UnaryOperationTestCase, BinaryOperationTestCase, InplaceOperationTestCase


class SliceTests(TranspileTestCase):
    def test_slice_list(self):
        self.assertCodeExecution("""
            x = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            print("x[:] = ", x[:])
            print("x[5:] = ", x[5:])
            print("x[:5] = ", x[:5])
            print("x[2:8] = ", x[2:8])

            print("x[::2] = ", x[::2])
            print("x[5::2] = ", x[5::2])
            print("x[:5:2] = ", x[:5:2])
            print("x[2:8:2] = ", x[2:8:2])

            print("x[::-1] = ", x[::-1])
            print("x[-5:-1:-1] = ", x[-5:-1:-1])
            print("x[-1:0:-1] = ", x[-1:0:-1])
            """)

        # Invalid slice indices
        # step 0
        self.assertCodeExecution("""
            x = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            print("x[2::0] = ", x[2::0])
        """)
        # start, stop and step must be int
        self.assertCodeExecution("""
            x = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            print("x[::2.5] = ", x[::2.5])
        """)

        self.assertCodeExecution("""
            x = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            print("x[::'a'] = ", x[::'a'])
        """)

        self.assertCodeExecution("""
            x = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            print("x['a':2] = ", x['a':2])
        """)

        self.assertCodeExecution("""
            x = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            print("x[1:'a':7] = ", x[1:'a':7])
        """)
        self.assertCodeExecution("""
            x = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            print("x[1:None] = ", x[1:None])
        """)

    def test_slice_range(self):
        self.assertCodeExecution("""
            x = range(0, 10)
            print("x[:] = ", x[:])
            print("x[5:] = ", x[5:])
            print("x[:5] = ", x[:5])
            print("x[2:8] = ", x[2:8])

            print("x[::2] = ", x[::2])
            print("x[5::2] = ", x[5::2])
            print("x[:5:2] = ", x[:5:2])
            print("x[2:8:2] = ", x[2:8:2])

            print("x[::-1] = ", x[::-1])
            print("x[-5:-1:-1] = ", x[-5:-1:-1])
            print("x[-1:0:-1] = ", x[-1:0:-1])
            """)

        # Invalid slice indices
        # step 0
        self.assertCodeExecution("""
            x = range(0, 10)
            print("x[2::0] = ", x[2::0])
        """)
        # start, stop and step must be int
        self.assertCodeExecution("""
            x = range(0, 10)
            print("x[::2.5] = ", x[::2.5])
        """)

        self.assertCodeExecution("""
            x = range(0, 10)
            print("x[::'a'] = ", x[::'a'])
        """)

        self.assertCodeExecution("""
            x = range(0, 10)
            print("x['a':2] = ", x['a':2])
        """)

        self.assertCodeExecution("""
            x = range(0, 10)
            print("x[1:'a':7] = ", x[1:'a':7])
        """)
        self.assertCodeExecution("""
            x = range(0, 10)
            print("x[1:None] = ", x[1:None])
        """)

    def test_slice_string(self):
        self.assertCodeExecution("""
            x = "0123456789a"
            print("x[:] = ", x[:])
            print("x[5:] = ", x[5:])
            print("x[:5] = ", x[:5])
            print("x[2:8] = ", x[2:8])

            print("x[::2] = ", x[::2])
            print("x[5::2] = ", x[5::2])
            print("x[:5:2] = ", x[:5:2])
            print("x[2:8:2] = ", x[2:8:2])

            print("x[::-1] = ", x[::-1])
            print("x[-5:-1:-1] = ", x[-5:-1:-1])
            print("x[-1:0:-1] = ", x[-1:0:-1])
            """)

        # Invalid slice indices
        # step 0
        self.assertCodeExecution("""
            x = "0123456789a"
            print("x[2::0] = ", x[2::0])
        """)
        # start, stop and step must be int
        self.assertCodeExecution("""
            x = "0123456789a"
            print("x[::2.5] = ", x[::2.5])
        """)

        self.assertCodeExecution("""
            x = "0123456789a"
            print("x[::'a'] = ", x[::'a'])
        """)

        self.assertCodeExecution("""
            x = "0123456789a"
            print("x['a':2] = ", x['a':2])
        """)

        self.assertCodeExecution("""
            x = "0123456789a"
            print("x[1:'a':7] = ", x[1:'a':7])
        """)
        self.assertCodeExecution("""
            x = "0123456789a"
            print("x[1:None] = ", x[1:None])
        """)

    def test_slice_tuple(self):
        self.assertCodeExecution("""
            x = (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
            print("x[:] = ", x[:])
            print("x[5:] = ", x[5:])
            print("x[:5] = ", x[:5])
            print("x[2:8] = ", x[2:8])

            print("x[::2] = ", x[::2])
            print("x[5::2] = ", x[5::2])
            print("x[:5:2] = ", x[:5:2])
            print("x[2:8:2] = ", x[2:8:2])

            print("x[::-1] = ", x[::-1])
            print("x[-5:-1:-1] = ", x[-5:-1:-1])
            print("x[-1:0:-1] = ", x[-1:0:-1])
            """)

        # step 0
        self.assertCodeExecution("""
            x = (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
            print("x[2::0] = ", x[2::0])
        """)
        # start, stop and step must be int
        self.assertCodeExecution("""
            x = (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
            print("x[::2.5] = ", x[::2.5])
        """)

        self.assertCodeExecution("""
            x = (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
            print("x[::'a'] = ", x[::'a'])
        """)

        self.assertCodeExecution("""
            x = (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
            print("x['a':2] = ", x['a':2])
        """)

        self.assertCodeExecution("""
            x = (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
            print("x[1:'a':7] = ", x[1:'a':7])
        """)
        self.assertCodeExecution("""
            x = (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
            print("x[1:None] = ", x[1:None])
        """)


class UnarySliceOperationTests(UnaryOperationTestCase, TranspileTestCase):
    data_type = 'slice'

    not_implemented = [
        'test_unary_invert',
        'test_unary_negative',
        'test_unary_not',
        'test_unary_positive',
    ]


class BinarySliceOperationTests(BinaryOperationTestCase, TranspileTestCase):
    data_type = 'slice'


class InplaceSliceOperationTests(InplaceOperationTestCase, TranspileTestCase):
    data_type = 'slice'
