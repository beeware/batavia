from unittest import expectedFailure
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

    def test_send_arg_count(self):
        self.assertCodeExecution("""
            def g():
                while True:
                    x = (yield)
                    print('>>', x)

            w = g()
            try:
                w.send()
            except Exception as e:
                print(type(e), e)
            try:
                w.send(1, 2)
            except Exception as e:
                print(type(e), e)
        """)

    def test_throw_type(self):
        self.assertCodeExecution("""
            def G():
                yield 1

            g = G()
            try:
                g.throw(Exception)
            except Exception as e:
                print(type(e), e)
        """)

    def test_throw_type_value(self):
        self.assertCodeExecution("""
            def G():
                yield 1

            g = G()
            try:
                g.throw(Exception, 'message')
            except Exception as e:
                print(type(e), e)
        """)

    def test_throw_instance(self):
        self.assertCodeExecution("""
            def G():
                yield 1

            g = G()
            try:
                g.throw(Exception('message'))
            except Exception as e:
                print(type(e), e)
        """)

    def test_next_after_throw(self):
        self.assertCodeExecution("""
            def G():
                yield 1
                yield 2

            g = G()
            try:
                g.throw(Exception)
            except:
                pass
            try:
                print(next(g))
            except StopIteration as e:
                print(type(e), e)
        """)

    def test_catch_inside(self):
        self.assertCodeExecution("""
            def G():
                try:
                    yield 1
                    yield 2
                except KeyError:
                    yield 3

            g = G()
            print(next(g))
            print(g.throw(KeyError))
            try:
                next(g)
            except Exception as e:
                print(type(e), e)
        """)

    def test_finished(self):
        self.assertCodeExecution("""
            def G():
                yield 1
                yield 2

            g = G()
            for x in g:
                print(x)
            try:
                print(next(g))
            except Exception as e:
                print(type(e), e)
        """)
