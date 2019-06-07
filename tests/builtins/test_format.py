from .. utils import TranspileTestCase, BuiltinFunctionTestCase

class FormatTests(TranspileTestCase):
   
    def test_format_can_buffer_strings_to_the_left(self):
            self.assertCodeExecution("""
                print(format("PAD", "#<10"))
                print(format("PAD", "?<10"))
            """, run_in_function=False)

    def test_given_only_a_value_it_returns_that_value(self):
            self.assertCodeExecution("""
                print(format("A simple string"))
                print(format(1))
                print(format(True))
            """, run_in_function=False)
    
    def test_given_sign_operator_it_adds_signs(self):
            self.assertCodeExecution("""
                print(format(0,"+"))
                print(format(10,"+"))
                print(format(-10,"+"))
                print(format(10,"-"))
                print(format(-10,"-"))
                print(format(10," "))
                print(format(-10," "))
            """, run_in_function=False)
    
    def test_given_sign_operator_it_rejects_strings(self):
            self.assertCodeExecution("""
            for operator in ["+","-"," "]:
                try:
                    print(format("heyo", operator))
                except ValueError as error:
                    print(error)
            """, run_in_function=False)

    def test_given_a_b_it_formats_binary(self):
            self.assertCodeExecution("""
                print(format(0,"b"))
                print(format(1,"b"))
                print(format(10,"b"))
                print(format(17,"b"))
            """, run_in_function=False)

    def test_given_a_b_plus_something_it_is_rejected(self):
            self.assertCodeExecution("""
            try:
                print(format(50,"b,"))
            except ValueError as error:
                print(error)
            """, run_in_function=False)

    def test_given_a_b_plus_something_it_is_rejected(self):
            self.assertCodeExecution("""
            try:
                print(format(50,"b,"))
            except ValueError as error:
                print(error)
            """, run_in_function=False)
    
    def test_given_a_b_strings_are_rejected(self):
            self.assertCodeExecution("""
            try:
                print(format("50","b"))
            except ValueError as error:
                print(error)
            """, run_in_function=False)

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
#     [sign][#]
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