from ..utils import TranspileTestCase

import unittest


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

    @unittest.expectedFailure
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

    def test_native(self):
        self.assertJavaScriptExecution(
            """
            import example

            print(example.foobar.__doc__)
            result = example.foobar(1, 2, 3)
            print("Result is", result)

            print('===')

            print(example.whizbang.__doc__)
            result = example.whizbang(4, 5, 6, ham=42, pork=37)
            print("Result is", result)

            print("Done.")
            """,
            js={
                'example':
                    """
                    var example = function(mod) {
                        console.log("Now we're in the example module");

                        mod.foobar = function(a, b, c) {
                            console.log("Calling foobar: " + a + ", " + b + ", " + c);
                            return 42
                        }
                        mod.foobar.__doc__ = "This is the foobar method"

                        mod.whizbang = function(args, kwargs) {
                            console.log("Whiz Bang! (" + args.length + " args)");
                            console.log('arg 1: ' + args[0]);
                            console.log('arg 2: ' + args[1]);
                            console.log('arg 3: ' + args[2]);
                            console.log('pork: ' + kwargs['pork']);
                            console.log('ham: ' + kwargs['ham']);
                            return kwargs['pork']
                        }
                        mod.whizbang.__doc__ = "This is the whizbang method"
                        mod.whizbang.$pyargs = true;
                        return mod;
                    }({});
                    """
            },
            out="""
            Now we're in the example module
            This is the foobar method
            Calling foobar: 1, 2, 3
            Result is 42
            ===
            This is the whizbang method
            Whiz Bang! (3 args)
            arg 1: 4
            arg 2: 5
            arg 3: 6
            pork: 37
            ham: 42
            Result is 37
            Done.
            """)

    def test_unpack_args(self):
        self.assertCodeExecution("""
            def myfunc(x, y, z):
                print('x =', x)
                print('y =', y)
                print('z =', z)

            myfunc(*[4, 2, 1])
            print('Done.')
        """)

    def test_unpack_kwargs(self):
        self.assertCodeExecution("""
            def myfunc(x, y, z):
                print('x =', x)
                print('y =', y)
                print('z =', z)

            myfunc(**{'z': 4, 'x': 1, 'y': 2})
            print('Done.')
        """)

    @unittest.expectedFailure
    def test_missing_keyword_args(self):
        self.assertCodeExecution("""
            def myfunc(x, *, z):
                print(x, z)
            
            myfunc(1)
            print('Done.')
        """)

    def test_missing_positional_args(self):
        self.assertCodeExecution("""
            def myfunc(x, y, z):
                print(x, y, z)
            
            myfunc()
            print('Done.')
        """)
