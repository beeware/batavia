from ..utils import TranspileTestCase


class GeneratorTests(TranspileTestCase):
    def test_simple_generator(self):
        self.assertCodeExecution("""
            def multiplier(first, second):
                y = first * second
                yield y
                y *= second
                yield y
                y *= second
                yield y
                y *= second
                yield y

            print(list(multiplier(1, 20)))
            """)

    def test_loop_generator(self):
        self.assertCodeExecution("""
            def fizz_buzz(start, stop):
                for i in range(start, stop):
                    found = False
                    if i % 2 == 0:
                        yield 'fizz'
                        found = True
                    if i % 3 == 0:
                        yield 'buzz'
                        found = True
                    if not found:
                        yield i

            print(list(fizz_buzz(1, 20)))
            """)

    def test_not_primed(self):
        self.assertCodeExecution("""
            def g():
                while True:
                    x = (yield)
                    print('>>', x)

            g().send(1)
        """)

    def test_simple_send(self):
        self.assertCodeExecution("""
            def g():
                while True:
                    x = (yield)
                    print('>>', x)

            w = g()
            w.send(None)
            w.send(1)
        """)
