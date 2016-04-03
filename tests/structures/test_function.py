from ..utils import TranspileTestCase


class FunctionTests(TranspileTestCase):
    def test_function(self):
        self.assertCodeExecution("""
            def myfunc(value):
                print(value * 3)
                return value + 5

            print("value =", myfunc(5))
            print('Done.')
            """)

    def test_void_function(self):
        self.assertCodeExecution("""
            def myfunc(value):
                print(value * 3)

            myfunc(5)
            print('Done.')
            """)

    def test_mainline(self):
        self.assertCodeExecution("""
            if __name__ == '__main__':
                print("Hello, world")
            """, run_in_function=False)

    def test_inner_function(self):
        self.assertCodeExecution("""
            def myfunc(value):
                print(value * 3)

                def myinner(value2):
                    print(value2 * 4)
                    return value2 + 6

                print("inner value =", myinner(10))
                return value + 5

            print("outer =", myfunc(5))
            print('Done.')
            """, run_in_function=False)

    # def test_closure(self):
    #     self.assertCodeExecution("""
    #         def myfunc(value):
    #             print(value * 3)

    #             def myinner(value2):
    #                 print(value2 * value)
    #                 return value2 + 6

    #             print("inner value =", myinner(10))
    #             return value + 5

    #         print("outer =", myfunc(5))
    #         print('Done.')
    #         """)

    def test_default_args(self):
        self.assertCodeExecution("""
            def myfunc(x, y=1, z=2):
                print("x =", x)
                print("y =", y)
                print("z =", z)

            myfunc(37)
            print('Done.')
            """, run_in_function=False)

    def test_override_some_default_args(self):
        self.assertCodeExecution("""
            def myfunc(x, y=1, z=2):
                print("x =", x)
                print("y =", y)
                print("z =", z)

            myfunc(37, 42)
            print('Done.')
            """, run_in_function=False)

    def test_overide_all_default_args(self):
        self.assertCodeExecution("""
            def myfunc(x, y=1, z=2):
                print("x =", x)
                print("y =", y)
                print("z =", z)

            myfunc(37, 42, 99)
            print('Done.')
            """, run_in_function=False)

    def test_use_kwargs(self):
        self.assertCodeExecution("""
            def myfunc(x, y=1, z=2):
                print("x =", x)
                print("y =", y)
                print("z =", z)

            myfunc(37, y=42)
            print('Done.')
            """, run_in_function=False)

    def test_use_kwargs_non_sequential(self):
        self.assertCodeExecution("""
            def myfunc(x, y=1, z=2):
                print("x =", x)
                print("y =", y)
                print("z =", z)

            myfunc(37, z=42)
            print('Done.')
            """, run_in_function=False)

    def test_use_all_kwargs(self):
        self.assertCodeExecution("""
            def myfunc(x, y=1, z=2):
                print("x =", x)
                print("y =", y)
                print("z =", z)

            myfunc(x=37, y=42, z=99)
            print('Done.')
            """, run_in_function=False)

    def test_use_all_kwargs_different_order(self):
        self.assertCodeExecution("""
            def myfunc(x, y=1, z=2):
                print("x =", x)
                print("y =", y)
                print("z =", z)

            myfunc(z=99, y=42, x=37)
            print('Done.')
            """, run_in_function=False)
