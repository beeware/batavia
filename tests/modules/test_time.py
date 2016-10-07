from ..utils import TranspileTestCase, adjust, SAMPLE_DATA
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

    def test_struct_time_valid(self):
        """
        valid construction
        """

        seed = list(range(1, 10))
        sequences = (
            bytes(seed),
            dict(zip(seed, seed)),
            frozenset(seed),
            seed,
            range(1, 10),
            set(seed),
            ''.join([str(i) for i in seed]),
            tuple(seed)
        )

        setup= adjust("""
        print('>>> import time')
        import time
        """)
        sequence_tests = [struct_time_setup(seq) for seq in sequences]
        test_str = ''.join(sequence_tests)
        self.assertCodeExecution(test_str)

    @unittest.expectedFailure
    def test_struct_time_bad_types(self):
        """
        currently bytearray will break the constructor
        """

        setup = adjust("""
        print('>>> import time')
        import time
        """)
        test_str = setup + adjust(struct_time_setup(bytearray([1]*9)))
        self.assertCodeExecution(test_str)

    def test_struct_time_valid_lengths(self):
        """
        length 9, 10, 11 are acceptable
        """

        setup= adjust("""
        print('>>> import time')
        import time
        """)
        sequence_tests = [struct_time_setup([1] * size) for size in range(9, 12)]
        test_str = ''.join(sequence_tests)
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

        setup= adjust("""
        print('>>> import time')
        import time
        """)
        sequence_tests = [struct_time_setup(seq) for seq in bad_types]
        test_str = ''.join(sequence_tests)
        self.assertCodeExecution(test_str)


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

    # TESTS FOR MKTIME
    def test_mktime(self):
        """
        tests the happy path for the mktime constructor
        """

        seq = (1970,1,1,0,0,0,0,0,0)

        test_str = adjust("""
        print('>>> import time')
        import time
        print('>>> seq = {seq}')
        seq = {seq}
        print(">>> time.mktime({seq})")
        print(time.mktime(seq))
        #################################
        print(">>> seq = time.struct_time({seq})")
        seq = time.struct_time({seq})
        print(">>> time.mktime(seq)")
        print(time.mktime(seq))
        """).format(seq=str(seq))

        self.assertCodeExecution(test_str)

    def test_mktime_bad_input(self):
        """
        When the argument passed is not tuple or struct_time.
        """

        seed = (1970,1,1,0,0,0,0,0,0)

        data = [
            False,
            1j,
            {key: key for key in seed},
            1.2,
            frozenset(seed),
            1,
            list(seed),
            range(1,2,3),
            set(seed),
            slice(1,2,3),
            '123456789',
            None,
            NotImplemented
        ]

        test_str = adjust("""
        print('>>> import time')
        import time
        """)

        tests = [mktime_setup(str(d)) for d in data]
        test_str += ''.join(tests)

        self.assertCodeExecution(test_str)

    def test_mktime_non_integer_types(self):
        """
        Tests behavior when non integer types are part of the sequence passed
        """

        test_str = adjust("""
        print('>>> import time')
        import time
        """)

        strange_types = [ SAMPLE_DATA[type][0] for type in SAMPLE_DATA if type != 'int' ]

        tests = [ mktime_setup( str((1970, t, 1, 2, 0, 0, 0, 0, 0)) ) for t in strange_types]
        test_str += ''.join(tests)

        self.assertCodeExecution(test_str)

    def test_mktime_seq_wrong_length(self):
        """
        Sequence has the wrong length
        """

        seq = (1970,1,1,0,0,0,0,0)  # length=8

        test_str = adjust("""
        print('>>> import time')
        import time
        """)

        test_str += mktime_setup(seq)
        print(test_str)
        self.assertCodeExecution(test_str)

    def test_mktime_wrong_arg_count(self):
        """
        Called with the wrong number of args
        """

        test_str = adjust("""
        print('>>> import time')
        import time
        print('>>> time.mktime()')
        print(time.mktime())
        ############################
        print('>>> time.mktime(1,2)')
        print(time.mktime(1,2))
        """)

        self.assertCodeExecution(test_str)

    @unittest.expectedFailure
    def test_mktime_overflow_error(self):
        """
        tests OverflowError on dates earlier than an arbitrarily defined date
        for now this is defined as 1900-01-01

        currently this can't be garuneteed to pass because it doesn't not account for behavior across platforms.
        """

        test_str = adjust("""
        print('>>> import time')
        import time
        """)

        years = (-1970, 70, 1899, 1900, 1901, 2016)
        sequences = [mktime_setup(str((year,) + (0,) * 8)) for year in years]
        test_str += ''.join(sequences)
        self.assertCodeExecution(test_str)

def struct_time_setup(seq = [1] * 9):
    """
    returns a string to set up a struct_time with seq the struct_time constructor
    :param seq: a valid sequence
    """

    test_str = adjust("""
    print("constructing struct_time with {type_name}")
    print(">>> st = time.struct_time({seq})")
    st = time.struct_time({seq})
    print('>>> st')
    print(st)
    """).format(type_name=type(seq), seq=seq)

    return test_str

def mktime_setup(seq):
    """
    :param seq: a string representation of a sequence
    :return: a test_string to call mktime based on seq
    """
    test_str = adjust("""
    print('''>>> time.mktime({seq})''')
    print(time.mktime({seq}))
    """).format(seq=seq)

    return test_str