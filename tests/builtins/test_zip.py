from .. utils import TranspileTestCase, BuiltinTwoargFunctionTestCase


class ZipTests(TranspileTestCase):

    def test_empty(self):
        self.assertCodeExecution("""
            x = zip()
            try:
                next(x)
            except Exception as e:
                print(e)
        """)

    def test_one_iterable(self):
        self.assertCodeExecution("""
            x = zip([1, 3, 5])
            print(type(x))
            print(type(iter(x)))
            print(x.__next__())
            print(next(x))
            print(next(x))
            try:
                next(x)
            except Exception as e:
                print(e)
        """)

    def test_two_iterables(self):
        self.assertCodeExecution("""
            x = zip([3, 4, 5], [10, 2, 5])
            for item in x:
                print(item)
            try:
                next(x)
            except Exception as e:
                print(e)
        """)

    def test_transcendental(self):
        template = """
            x = zip(%s)
            for item in x:
                print(item)
            try:
                next(x)
            except Exception as e:
                print(e)
        """
        test_cases = [
            ['"hello"', '"world"'],
            ['[1, 2, 3]', '[5, 4]'],
            ['[]', '[1, 2, 3]'],
            ['[1, 2, 3]', '[]'],
            ['[]', '()'],
            ['(4, 5)', '[1, 2, 3]'],
            ['(1, 2, 3, 4)', '(5, 6)', '(3, 4, 5)'],
            ['"string"', '("this", "is", "a", "tuple")'],
            ['[True, 5.5, (1, 2)]', 'b"hello"', '(None, (float("inf"), "s"), range(10))'],
        ]

        code = '\n'.join(template % ', '.join(inputs) for inputs in test_cases)
        self.assertCodeExecution(code)

    def test_invalid_inputs(self):
        template = """
            try:
                x = zip(%s)
            except TypeError as e:
                print(e)
        """
        test_cases = [
            ['3'],
            ['1.5'],
            ['[1, 2, 3]', 'False'],
            ['"string"', 'None'],
            ['"valid"', '("o", "k")', '500'],
        ]

        code = '\n'.join(template % ', '.join(inputs) for inputs in test_cases)
        self.assertCodeExecution(code)


class BuiltinFilterFunctionTests(BuiltinTwoargFunctionTestCase, TranspileTestCase):
    functions = ["zip"]

    not_implemented = []
