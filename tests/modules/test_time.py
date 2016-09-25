from ..utils import TranspileTestCase

import unittest
import time

class TimeTests(TranspileTestCase):
    @unittest.expectedFailure
    def test_time(self):
        self.assertCodeExecution("""
            import time
            # Demonstrate that we're getting the same type...
            print(type(time.time()))
            # ...and that type is infact a float.
            print(isinstance(time.time(), float))
            print('Done.')
            """)

    def test_sleep(self):
        self.assertCodeExecution("""
            import time
            time.sleep(.1)
            print('Done.')
            """)

    def test_sleep_negative(self):
        self.assertCodeExecution("""
            import time
            try:
                time.sleep(-1)
            except ValueError as err:
                print(err)
            print('Done.')
            """)

    def test_struct_time_valid(self):
        # valid construction

        seed = list(range(1, 10))
        sequences = (
            bytearray(seed),
            bytes(seed),
            dict(zip(seed, seed)),
            frozenset(seed),
            seed,
            range(1, 10),
            set(seed),
            ''.join([str(i) for i in seed]),
            tuple(seed)
        )

        for seq in sequences:
            st = time.struct_time(seq)
            self.assertCodeExecution("""
            print('>>> import time')
            import time
            print(">>> st = time.struct_time({seq})")
            st = time.struct_time({seq})
            print('>>> st')
            print(st)
            """.format(seq=seq))