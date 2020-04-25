from .. utils import TranspileTestCase, BuiltinFunctionTestCase, transforms


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

    @transforms(
        decimal=False,
        float_exp=False,
        high_precision_float=False,
        js_bool=False,
        complex_num=False
    )
    def test_simple_format(self, js_cleaner, py_cleaner):
        self.assertCodeExecution("""
            print(format(1, '*>4X'))
            print(format(150, '#04d'))
            print(format(15000.0, '#015G'))
            """, js_cleaner=js_cleaner, py_cleaner=py_cleaner)

    def test_format_with_empty_string_for_second_arg_is_same_as_str(self):
        self.assertCodeExecution("""
            print(format("string", ""))
        """, run_in_function=False)


class BuiltinFormatFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "format"
