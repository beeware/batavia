from .. utils import TranspileTestCase, BuiltinFunctionTestCase

class FormatTests(TranspileTestCase):
    
    def test_format_throws_error_if_given_zero_args(self):
        self.assertCodeExecution("""
            try:
                print(format())
            except TypeError as error:
                print(error)
        """, run_in_function=False) 

    def test_format_throws_an_error_if_given_too_many_arguments(self):
        self.assertCodeExecution("""
            try:
                print(format("Too","Many","Args"))
            except TypeError as error:
                print(error)
            try:
                print(format("Way","Too","Many","Args"))
            except TypeError as error:
                print(error)
        """, run_in_function=False) 

    def test_format_with_empty_string_for_second_arg_is_same_as_str(self):
        self.assertCodeExecution("""
            print(format("Too",""))
            print(format(100,""))
            print(format({1 : "3"},""))
            print(format(3 + 2j,""))
            print(format(1.0,""))
            print(format((3, 4, 4, 5),""))
            print(format([ "a", "b", "c"],""))
        """, run_in_function=False) 

    # TODO: Remove NotImplementedErrors when matching type.__format__ function 
    # is finally implemented
    def test_given_a_type_it_defers_to_that_types_formatting(self):
        self.assertCodeExecution("""
            # type int, float, long, complex
            # type str, unicode, list, tuple, bytearray, buffer, xrange
            # type set, frozenset
            # type dict
            try:
                # All forward to string type
                print(format("simple string", "#^16"))
            except NotImplementedError:
                print(format("#simple string##"))
            try:
                # All forward to float type
                print(format(10340.2, "@>10,.3"))
            except NotImplementedError:
                print('@@1.03e+04')
            try:
                # All forward to int type
                print(format(1000, "b"))
                print(format(1000, "x"))
                print(format(1000, "X"))
            except NotImplementedError:
                print('1111101000')
                print('3e8')
                print('3E8')
        """, run_in_function=False) 


    def test_given_only_a_value_it_returns_that_value(self):
            self.assertCodeExecution("""
                print(format("A simple string"))
                print(format(1))
                print(format(0o7757))
                print(format(1.0))
                print(format(.4e7))
                print(format(2+3j))
                print(format(0x10aa))
                print(format(0b1010))
                print(format(True))
            """, run_in_function=False)

    
    # def test_format_can_align_numbers(self):
    #         self.assertCodeExecution("""
    #             print(format("10", "#>10"))
    #             print(format(10, "#<10"))
    #         """, run_in_function=False)
   
    # def test_format_can_buffer_strings_to_the_left(self):
    #         self.assertCodeExecution("""
    #             print(format("PAD", "#<10"))
    #             print(format("PAD", "?<7"))
    #             print(format("PADDING", "?<2"))
    #         """, run_in_function=False)
    
    # def test_format_can_buffer_strings_to_the_right(self):
    #         self.assertCodeExecution("""
    #             print(format("PAD", "#>10"))
    #             # print(format("PAD", "?>7"))
    #             # print(format("PADDING", "?>2"))
    #         """, run_in_function=False)
    
    # def test_given_sign_operator_it_adds_signs(self):
    #         self.assertCodeExecution("""
    #             print(format(0,"+"))
    #             print(format(10,"+"))
    #             print(format(-10,"+"))
    #             print(format(10,"-"))
    #             print(format(-10,"-"))
    #             print(format(10," "))
    #             print(format(-10," "))
    #         """, run_in_function=False)
    
    # def test_given_sign_operator_it_rejects_strings(self):
    #         self.assertCodeExecution("""
    #         for operator in ["+","-"," "]:
    #             try:
    #                 print(format("heyo", operator))
    #             except ValueError as error:
    #                 print(error)
    #         """, run_in_function=False)

    # def test_given_a_b_it_formats_binary(self):
    #         self.assertCodeExecution("""
    #             print(format(0,"b"))
    #             print(format(1,"b"))
    #             print(format(10,"b"))
    #             print(format(17,"b"))
    #         """, run_in_function=False)

    # def test_given_a_b_plus_something_it_is_rejected(self):
    #         self.assertCodeExecution("""
    #         try:
    #             print(format(50,"b,"))
    #         except ValueError as error:
    #             print(error)
    #         """, run_in_function=False)

    # def test_given_a_b_plus_something_it_is_rejected(self):
    #         self.assertCodeExecution("""
    #         try:
    #             print(format(50,"b,"))
    #         except ValueError as error:
    #             print(error)
    #         """, run_in_function=False)
    
    # def test_given_a_b_strings_are_rejected(self):
    #         self.assertCodeExecution("""
    #         try:
    #             print(format("50","b"))
    #         except ValueError as error:
    #             print(error)
    #         """, run_in_function=False)

#    def test_single_string_substitution(self):
#         self.assertCodeExecution("""
#             # integer
#             print(format(123, "d"))

#             # float arguments
#             print(format(123.4567898, "f"))

#             # binary format
#             print(format(12, "b"))
#         """, run_in_function=False) 

#     [[fill]align]
#     [sign]
#     [#]
#     [0][width][,][.precision]
#     [type]
#     where, the options are
#     fill        ::=  any character
#     align       ::=  "<" | ">" | "=" | "^"
#     sign        ::=  "+" | "-" | " "
#     width       ::=  integer
#     precision   ::=  integer
#     type        ::=  "b" | "c" | "d" | "e" | "E" | "f" | "F" | "g" | "G" | "n" | "o" | "s" | "x" | "X" | "%" 
   
class BuiltinFormatFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "format"