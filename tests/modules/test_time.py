from ..utils import TranspileTestCase

import unittest


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

    @unittest.expectedFailure
    def test_struct_time_valid(self):
        """
        valid construction
        """

        # TODO: this won't pass until bytearay is iterable

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
            self.assertCodeExecution(struct_time_setup(seq))

    def test_struct_time_valid_lengths(self):
        """
        length 9, 10, 11 are acceptable
        """

        for size in range(9, 12):
            test_str = struct_time_setup([1] * size)
            self.assertCodeExecution(test_str)

    def test_struct_time_invalid(self):
        """
        invalid construction due to bad type
        """

        bad_types = [
            True,
            0j,
            1,
            None,
            NotImplemented
        ]

        for t in bad_types:
            self.assertCodeExecution(struct_time_setup(t))


    def test_struct_time_too_short(self):
        """
        sequence less than length 9 is passed
        should raise an index error
        """
        self.assertCodeExecution(struct_time_setup([1]*8))


    def test_struct_time_too_long(self):
        """
        sequence longer than length 9 is allowed
        """
        self.assertCodeExecution(struct_time_setup([1]*12))

    def test_struct_time_attrs(self):
        """
        tests for struct_time attributes
        """

        setup = struct_time_setup()

        fields = ['n_fields', 'n_unnamed_fields', 'n_sequence_fields', 'tm_year', 'tm_mon', 'tm_mday', 'tm_hour', 'tm_min',
                  'tm_sec', 'tm_wday', 'tm_yday', 'tm_isdst', 'tm_zone', 'tm_gmtoff']
        test_strs = [adjust("""
            print('>>> st.{attr}')
            print(st.{attr})
        """.format(attr=attr)) for attr in fields]

        self.assertCodeExecution(setup + ''.join(test_strs))

    def test_get_item(self):
        """
        tries __getitem__ for index -12-12
        """

        setup = struct_time_setup([1] * 11)
        get_indecies = [adjust("""
        print('>>> st[{i}]')
        print(st[{i}])
        """)for i in range(-12, 13)]

        self.assertCodeExecution(setup + ''.join(get_indecies))

    def test_struct_time_str(self):
        """
        tests the str method
        """

        test_str = struct_time_setup()
        test_str += adjust("""
        print('>>> str(st)')
        print(str(st))
        """)

        self.assertCodeExecution(adjust(test_str))

    def test_struct_time_repr(self):
        """
        tests the repr method
        """

        test_str = struct_time_setup()
        test_str += adjust("""
        print('>>> repr(st)')
        print(repr(st))
        """)

        self.assertCodeExecution(adjust(test_str))


def struct_time_setup(seq = [1] * 9):
    """
    returns a string to set up a struct_time with seq the struct_time constructor
    :param seq: a valid sequence
    """

    test_str = adjust("""
    print("constructing struct_time with {type_name}")
    print('>>> import time')
    import time
    print(">>> st = time.struct_time({seq})")
    st = time.struct_time({seq})
    print('>>> st')
    print(st)
    """).format(type_name=type(seq), seq=seq)

    return test_str