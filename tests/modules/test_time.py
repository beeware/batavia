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
        """
        valid construction
        """

        # TODO: this won't pass until the follownig types have .length return their length (currently they return undefined)
        #     bytearray,
        #     bytes,
        #     dict,
        #     frozenset,
        #     range,
        #     set,

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
            print("trying with {type}")
            print('>>> import time')
            import time
            print(">>> st = time.struct_time({seq})")
            st = time.struct_time({seq})
            print('>>> st')
            print(st)
            """.format(type=type(seq), seq=seq))

    def struct_time_invalid(self):
        """
        invalid construction due to bad type
        """

        bad_types = [
            False,
            0j,
            filter,
            1,
            map,
            None,
            NotImplemented,
            slice,
            type
        ]