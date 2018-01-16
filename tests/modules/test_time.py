import os
import re
from time import gmtime, localtime, mktime
from ..utils import TranspileTestCase, adjust, SAMPLE_DATA, runAsPython
import unittest


class TimeTests(TranspileTestCase):

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

        seq = (1970, 1, 1, 0, 0, 0, 0, 0, 0)

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

    def test_mktime_args(self):
        """
        alter arguments 0-6 one by one
        """

        test_str = adjust("""
        print('>>> import time')
        import time
        """)
        seed = [1970, 1, 1, 0, 0, 0, 0, 0, -1]
        for i in range(7):
            seq = seed[:]
            if i == 0:
                seq[i] = 1999    # change the year
            else:
                seq[i] = 5  # change something else
                if i == 1:
                    seq[8] = 1  # change dst value if needed

            test_str += mktime_setup(str(tuple(seq)))

        self.assertCodeExecution(test_str)

    def test_mktime_dst(self):
        """
        tests with each month of the year
        """

        seed = [1970, 1, 1, 0, 0, 0, 0, 0, -1]

        test_str = adjust("""
        print('>>> import time')
        import time
        """)
        for month in range(1, 13):
            seq = seed[:]
            seq[1] = month
            if month <= 3 or month == 12:
                seq[8] = 0  # dst off
            else:
                seq[8] = 1  # dst on
            test_str += adjust("""
            print('trying month {}')
            """.format(month))
            test_str += mktime_setup(str(tuple(seq)))

        self.assertCodeExecution(test_str)

    def test_mktime_bad_input(self):
        """
        When the argument passed is not tuple or struct_time.
        """

        seed = (1970, 1, 1, 0, 0, 0, 0, 0, 0)

        data = (
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
        )

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

        strange_types = [SAMPLE_DATA[type][0] for type in SAMPLE_DATA if type != 'int']

        tests = [ mktime_setup(str((1970, t, 1, 2, 0, 0, 0, 0, 0))) for t in strange_types]
        test_str += ''.join(tests)

        self.assertCodeExecution(test_str)

    def test_mktime_seq_wrong_length(self):
        """
        Sequence has the wrong length
        """

        seq = (1970, 1, 1, 0, 0, 0, 0, 0)  # length == 8

        test_str = adjust("""
        print('>>> import time')
        import time
        """)

        test_str += mktime_setup(str(seq))
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

    def test_mktime_too_early(self):
        """
        tests OverflowError on dates earlier than an arbitrarily defined date 1900-01-01
        Because the CPython implementation of mktime varies across platforms, this likely won't match behavior
        regarding the smallest possible year that can be entered.
        """

        set_up = adjust("""
        print('>>> import time')
        import time
        """)

        bad_years = (-1970, 70, 1899)

        for year in bad_years:
            test_str = set_up + mktime_setup(str((year, 1, 1, 0, 0, 0, 0, 0, 0)))

            # NOTE: because each example will raise an error, a new VM must be used for each example.
            self.assertJavaScriptExecution(test_str,
                                           js={},
                                           run_in_function=False,
                                           out="""
                >>> import time
                >>> time.mktime(({}, 1, 1, 0, 0, 0, 0, 0, 0))
                ### EXCEPTION ###
                OverflowError: mktime argument out of range
                    test.py:4
                """.format(year))

    def test_mktime_too_late(self):
        """
        tests that the year given is too large. mktime will fail when the date passed to the javascript Date constructor
        is too large per ECMA spec
        source: http://ecma-international.org/ecma-262/5.1/#sec-15.9.1.1
        """
        ok_date = [300000, 1, 1, 1, 0, 0, 0, 0, 0]  # one exceeding date
        bad_date = [275758, 1, 1, 1, 0, 0, 0, 0, 0]  # one just-ok date

        set_up = adjust("""
        print('>>> import time')
        import time
        """)

        expected_output = adjust("""
            >>> import time
            >>> time.mktime({seed_expand})
            ### EXCEPTION ###
            OverflowError: signed integer is greater than maximum
                test.py:4
            """)

        self.assertJavaScriptExecution(
            set_up + mktime_setup(str(tuple(ok_date))),
            run_in_function=False,
            same=True,
            out=expected_output.format(seed_expand=str(tuple(ok_date))))

        self.assertJavaScriptExecution(
            set_up + mktime_setup(str(tuple(bad_date))),
            run_in_function=False,
            same=False,
            out=expected_output.format(seed_expand=str(tuple(bad_date))))


    def test_mktime_no_overflow_error(self):
        """
        years that will not throw an OverflowError
        """

        set_up = adjust("""
        print('>>> import time')
        import time
        """)

        good_years = (1900, 1970, 2016)
        for year in good_years:
            seq = (year, 1, 1, 0, 0, 0, 0, 0, 0)
            test_str  = set_up + mktime_setup(str(seq))

            # need to compare each example individually
            self.assertJavaScriptExecution(test_str,
                                           js={},
                                           run_in_function=False,
                                           same=False,
                                           out="""
            >>> time.mktime(({}, 1, 1, 0, 0, 0, 0, 0, 0))
            ### EXCEPTION ###
            OverflowError: signed integer is greater than maximum
                test.py:4
            """.format(year))

    # TESTS FOR GMTIME
    def test_gmtime_no_arg(self):
        """
        test for gmtime with no arugment
        """

        test_str = adjust("""
        print('>>> import time')
        import time
        print('>>> time.gmtime()')
        print(time.gmtime())
        """)

        # set up a temp directory
        self.makeTempDir()

        # run as both Python and JS (Python first
        # to ensure code is rolled out for JS to use)
        py_out = runAsPython(self.temp_dir, test_str)
        js_out = self.runAsJavaScript(test_str, js={})
        outputs = [py_out, js_out]

        raw_times = [out.split('\n')[2] for out in outputs]  # each item will be a string representation of struct_time

        # regex to parse struct_time
        match_str = 'time\.struct_time\(tm_year=(?P<year>-?\d{1,4}), tm_mon=(?P<mon>-?\d{1,2}), tm_mday=(?P<mday>-?\d{1,2}), tm_hour=(?P<hour>-?\d{1,2}), tm_min=(?P<min>-?\d{1,2}), tm_sec=(?P<sec>-?\d{1,2}), tm_wday=(?P<wday>-?\d{1}), tm_yday=(?P<yday>-?\d{1,4}), tm_isdst=(?P<isdst>-?\d{1})\)'

        times = []
        for raw in raw_times:
            match = re.search(match_str, raw)
            attrs = [int(match.group(i)) for i in range(1, 10)]   # grab each attr from struct_tine
            times.append(mktime(tuple(attrs)))

        self.assertAlmostEqual(times[0], times[1], delta=2)  # times should be within 2 seconds of each other

    def test_gmtime_with_arg(self):

        test_str = adjust("""
        print('>>> import time')
        import time
        print('>>> time.gmtime(1000)')
        print(time.gmtime(1000))
        """)

        self.assertCodeExecution(test_str)

    def test_gmtime_dst(self):
        """
        test all months to demonstrate dst is not messing with things
        """

        test_str = adjust("""
        print('>>> import time')
        import time
        """)

        test_str += ''.join([adjust("""
        print('>>> time.gmtime({seq})')
        time.gmtime({seq})
        """.format(seq=str((2016, month, 1, 0, 0, 0, 0, 0, -1)))) for month in range(1,13)])

        self.assertCodeExecution(test_str)

    def test_gmtime_too_many_args(self):

        test_str = adjust("""
        print('>>> import time')
        import time
        print('>>> time.gmtime(1,2)')
        print(time.gmtime(1,2))
        """)

        self.assertCodeExecution(test_str)

    def test_gmtime_bad_type(self):
        """
        only int or float allowed
        """

        bad_types = [SAMPLE_DATA[t][0] for t in SAMPLE_DATA if t not in ['int', 'float', 'None']]

        test_strs = [adjust("""
        print('>>> import time')
        import time
        print('>>> time.gmtime({item})')
        print(time.gmtime({item}))
        """.format(item=item)) for item in bad_types]

        for t_str in test_strs:
            self.assertCodeExecution(t_str)

    def test_gmtime_argument_range(self):
        """
        tests for values exceding +- 8640000000000000 ms (limit for JS)
        """

        limit_abs = 8640000000000000 / 1000

        for adder in range(2):
            for factor in [-1, 1]:
                seconds = factor * (limit_abs + adder)
                test_str = adjust("""
                    print('>>> import time')
                    import time
                    print('>>> time.gmtime({seconds})')
                    print(time.gmtime({seconds}))
                    """.format(seconds=seconds))

                throws_error = adder == 1
                self.assertJavaScriptExecution(test_str,
                                               js={},
                                               run_in_function=False,
                                               same=throws_error,   # when exceeding the limit, expect an error
                                               out=adjust("""
                >>> import time
                >>> time.gmtime({seconds})
                ### EXCEPTION ###
                OSError: Value too large to be stored in data type
                    test.py:4
                """).format(seconds=seconds))

    # TESTS FOR LOCALTIME
    def test_localtime_no_arg(self):
        """
        test for gmtime with no arugment
        """

        test_str = adjust("""
        print('>>> import time')
        import time
        print('>>> time.localtime()')
        print(time.localtime())
        """)

        # set up a temp directory
        self.makeTempDir()

        # run as both Python and JS (Python first
        # to ensure code is rolled out for JS to use)
        py_out = runAsPython(self.temp_dir, test_str)
        js_out = self.runAsJavaScript(test_str, js={})
        outputs = [py_out, js_out]

        print (outputs)
        raw_times = [out.split('\n')[2] for out in outputs]  # each item will be a string representation of struct_time
        # regex to parse struct_time
        match_str = 'time\.struct_time\(tm_year=(?P<year>-?\d{1,4}), tm_mon=(?P<mon>-?\d{1,2}), tm_mday=(?P<mday>-?\d{1,2}), tm_hour=(?P<hour>-?\d{1,2}), tm_min=(?P<min>-?\d{1,2}), tm_sec=(?P<sec>-?\d{1,2}), tm_wday=(?P<wday>-?\d{1}), tm_yday=(?P<yday>-?\d{1,4}), tm_isdst=(?P<isdst>-?\d{1})\)'

        times = []
        for raw in raw_times:
            match = re.search(match_str, raw)
            attrs = [int(match.group(i)) for i in range(1, 10)]   # grab each attr from struct_tine
            times.append(mktime(tuple(attrs)))

        self.assertAlmostEqual(times[0], times[1], delta=2)  # times should be within 2 seconds of each other

    def test_localtime_with_arg(self):

        test_str = adjust("""
        print('>>> import time')
        import time
        print('>>> time.localtime(1000)')
        print(time.localtime(1000))
        """)

        self.assertCodeExecution(test_str)

    def test_localtime_dst(self):
        """
        test all months to ensure dst works as expected
        """

        test_str = adjust("""
        print('>>> import time')
        import time
        """)

        test_str += ''.join([adjust("""
        print('>>> time.localtime({seq})')
        time.localtime({seq})
        """.format(seq=str((2016, month, 1, 0, 0, 0, 0, 0, -1)))) for month in range(1,13)])

        self.assertCodeExecution(test_str)

    def test_localtime_too_many_args(self):

        test_str = adjust("""
        print('>>> import time')
        import time
        print('>>> time.localtime(1,2)')
        print(time.localtime(1,2))
        """)

        self.assertCodeExecution(test_str)

    def test_localtime_bad_type(self):
        """
        only int or float allowed
        """

        bad_types = [SAMPLE_DATA[t][0] for t in SAMPLE_DATA if t not in ['int', 'float', 'None']]

        test_strs = [adjust("""
        print('>>> import time')
        import time
        print('>>> time.localtime({item})')
        print(time.localtime({item}))
        """.format(item=item)) for item in bad_types]

        for t_str in test_strs:
            self.assertCodeExecution(t_str)

    def test_localtime_argument_range(self):
        """
        tests for values exceding +- 8640000000000000 ms (limit for JS)
        """

        limit_abs = 8640000000000000 / 1000

        for adder in range(2):
            for factor in [-1, 1]:
                seconds = factor * (limit_abs + adder)
                test_str = adjust("""
                    print('>>> import time')
                    import time
                    print('>>> time.localtime({seconds})')
                    print(time.localtime({seconds}))
                    """.format(seconds=seconds))

                throws_error = adder == 1
                self.assertJavaScriptExecution(test_str,
                                               js={},
                                               run_in_function=False,
                                               same=throws_error,   # when exceeding the limit, expect an error
                                               out=adjust("""
                >>> import time
                >>> time.localtime({seconds})
                ### EXCEPTION ###
                OSError: Value too large to be stored in data type
                    test.py:4
                """).format(seconds=seconds))


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
