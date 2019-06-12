from .. utils import TranspileTestCase, BuiltinFunctionTestCase

class FormatTests(TranspileTestCase):
    
    def test_format_throws_error_if_given_zero_args(self):
        self.assertCodeExecution("""
            try:
                print(format())
            except TypeError as error:
                print(error)
        """, run_in_function=False) 
    
    def test_passthrough_formats(self):
        self.assertCodeExecution("""
            print(format([], ""))
            print(format(iter([]), ""))
            print(format(bytearray(), ""))
            print(format(iter(bytearray()), ""))
            print(format({"key": "pair"}, ""))
            print(format(bytes(), ""))
            print(format(enumerate([1,2]), ""))
            print(format(frozenset(), ""))
            print(format(map([], []), ""))
            print(format(range(3), ""))
            print(format(iter(range(3)), ""))
            print(format(iter(""), ""))
            print(format({"dog"}, ""))
            print(format(iter({"dog"}), ""))
            print(format((1,2,3), ""))
            print(format(iter((1,2,3))), "")
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

class BuiltinFormatFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "format"
