from .. utils import TranspileTestCase

import unittest


class SliceTests(TranspileTestCase):
    @unittest.expectedFailure
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
            """)

    @unittest.expectedFailure
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
            """)

    @unittest.expectedFailure
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
            """)

    @unittest.expectedFailure
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
            """)
