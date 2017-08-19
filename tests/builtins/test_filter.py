from .. utils import TranspileTestCase, BuiltinTwoargFunctionTestCase


class FilterTests(TranspileTestCase):
    base_code = """
            x = %s
            def testish(x):
                return %s

            print(x)
            print(filter(testish, x))
            mylist = iter(x)
            print(filter(testish, x).__next__())
            print(filter(testish, x).__next__())
            print(filter(testish, x).__next__())
            print(type(iter(x)))
            try:
                print(filter(testish, mylist).__next__())
            except StopIteration:
                pass
    """

    def test_bool(self):
        self.assertCodeExecution(self.base_code % ("[True, False, True]", "bool(x)"), run_in_function=False)

    def test_bytearray(self):
        self.assertCodeExecution(self.base_code % ("b'123'", "x"), run_in_function=False)

    def test_float(self):
        self.assertCodeExecution(self.base_code % ("[3.14, 2.17, 1.0]", "x > 1"), run_in_function=False)

    def test_int(self):
        self.assertCodeExecution(self.base_code % ("[1, 2, 3]", "x * 2"), run_in_function=False)


class BuiltinFilterFunctionTests(BuiltinTwoargFunctionTestCase, TranspileTestCase):
    function = "filter"

    not_implemented = []
