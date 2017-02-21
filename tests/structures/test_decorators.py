from ..utils import TranspileTestCase


class DecoratorTests(TranspileTestCase):
    def test_simple_decorator(self):
        self.assertCodeExecution("""
            def thing(fn):
                def _dec(value):
                    print("Start decoration.")
                    result = fn(value)
                    print("End decoration.")
                    return result * 42
                return _dec

            @thing
            def calculate(value):
                print("Do a calculation")
                return 37 * value

            print("Decorated result is", calculate(5))
            print("Done.")
            """)

    def test_decorator_with_argument(self):
        self.assertCodeExecution("""
            def thing(multiplier):
                def _dec(fn):
                    def _fn(value):
                        print("Start decoration.")
                        result = fn(value)
                        print("End decoration.")
                        return result * multiplier
                    return _fn
                return _dec

            @thing(42)
            def calculate(value):
                print("Do a calculation")
                return 37 * value

            print("Decorated result is", calculate(5))
            print("Done.")
            """)
