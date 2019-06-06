from .. utils import TranspileTestCase, BuiltinFunctionTestCase

class FormatTests(TranspileTestCase):
   
   def test_given_only_a_string(self):
        self.assertCodeExecution("""
            print(format("A simple string"))
            print(format(1))
            print(format(True))
            print(format(0b))
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

#    [[fill]align][sign][#][0][width][,][.precision][type]
#     where, the options are
#     fill        ::=  any character
#     align       ::=  "<" | ">" | "=" | "^"
#     sign        ::=  "+" | "-" | " "
#     width       ::=  integer
#     precision   ::=  integer
#     type        ::=  "b" | "c" | "d" | "e" | "E" | "f" | "F" | "g" | "G" | "n" | "o" | "s" | "x" | "X" | "%" 
   
class BuiltinFormatFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "format"