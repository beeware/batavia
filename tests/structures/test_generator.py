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

    def test_stop_after_raise(self):
        self.assertCodeExecution("""
            def G():
                yield 1
                raise Exception('2')
                yield 3

            g = G()
            print(next(g))
            try:
                next(g)
            except Exception as e:
                print(type(e), e)
            try:
                print(next(g))
            except Exception as e:
                print(type(e), e)
        """)

    def test_close(self):
        self.assertCodeExecution("""
            def G():
                yield 1
                yield 2

            g = G()
            print(next(g))
            g.close()
            try:
                print(next(g))
            except BaseException as e:
                print(type(e), e)
        """)

    def test_nested(self):
        self.assertCodeExecution("""
            def G():
                while True:
                    try:
                        v = (yield)
                    except KeyError:
                        print('ERROR')
                    else:
                        print('>>', v)

            def F(g):
                g.send(None)
                while True:
                    try:
                        try:
                            v = (yield)
                        except Exception as e:
                            g.throw(e)
                        else:
                            g.send(v)
                    except StopIteration:
                        pass

            g = G()
            g2 = F(g)
            g2.send(None)
            g2.send(1)
            g2.send(2)
            g2.throw(KeyError)
            g2.send(3)
        """)


class YieldFromTests(TranspileTestCase):
    def test_simple_generator(self):
        self.assertCodeExecution("""
            def G(x):
                yield from x

            def F():
                yield 1
                yield 2

            g = G(F())
            print(list(g))
        """)

    def test_yield_before_and_after(self):
        self.assertCodeExecution("""
            def G(x):
                yield "START"
                yield from x
                yield "STOP"

            def F():
                yield 1
                yield 2

            g = G(F())
            print(list(g))
        """)

    def test_iterator(self):
        self.assertCodeExecution("""
            def G(x):
                yield "START"
                yield from x
                yield "STOP"

            g = G(range(5))
            print(list(g))
        """)

    def test_throw(self):
        self.assertCodeExecution("""
            def G():
                yield 1
                yield 2
                yield 3

            def F(g):
                yield from g

            f = F(G())
            print(next(f))
            try:
                f.throw(KeyError)
            except Exception as e:
                print(type(e), e)
            try:
                print(next(f))
            except Exception as e:
                print(type(e), e)
        """)

    def test_catch_exception(self):
        self.assertCodeExecution("""
            def G():
                while True:
                    try:
                        v = (yield)
                    except KeyError:
                        print('ERROR')
                    else:
                        print('>>', v)

            def F(g):
                yield from g

            g = F(G())
            g.send(None)
            g.send(1)
            g.send(2)
            g.throw(KeyError)
            g.send(3)
        """)

    def test_throw_iterator(self):
        self.assertCodeExecution("""
            def G(g):
                yield from g

            g = G(range(5))
            next(g)
            try:
                g.throw(KeyError)
            except Exception as e:
                print(type(e), e)
        """)

    def test_pyclass_subgenerator(self):
        self.assertCodeExecution("""
            class Gen:
                def __init__(self):
                    self.stopped = False
                    self.i = -1
                def __next__(self):
                    if not self.stopped:
                        self.i += 1
                        return self.i
                    raise StopIteration
                def __iter__(self):
                    return self
                def close(self):
                    self.stopped = True

            def G(g):
                yield 'START'
                yield from g
                yield 'STOP'

            g = Gen()
            gg = G(g)
            print(next(gg))
            print(next(gg))
            print(gg.close())
            try:
                print(next(gg))
            except StopIteration as e:
                print(type(e), e)
        """)

    def test_pyclass_custom_throw(self):
        self.assertCodeExecution("""
            class Gen:
                def __init__(self):
                    self.stopped = False
                    self.i = -1
                def __next__(self):
                    if not self.stopped:
                        self.i += 1
                        return self.i
                    raise StopIteration
                def __iter__(self):
                    return self
                def close(self):
                    self.stopped = True
                def throw(self, a, b, c):
                    print('THROW')

            def G(g):
                yield 'START'
                yield from g
                yield 'STOP'

            g = Gen()
            gg = G(g)
            print(next(gg))
            print(next(gg))
            print(gg.close())
            try:
                print(next(gg))
            except StopIteration as e:
                print(type(e), e)
        """)
