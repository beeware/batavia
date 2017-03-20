from ..utils import TranspileTestCase

from unittest import expectedFailure


class ClassTests(TranspileTestCase):
    def test_minimal(self):
        self.assertCodeExecution("""
            class MyClass:
                pass

            obj = MyClass()

            print('Done.')
            """, run_in_function=False)

    def test_simple(self):
        self.assertCodeExecution("""
            class MyClass:
                def __init__(self, val):
                    print("VAL: ", val)
                    self.value = val

                def stuff(self, delta):
                    print("DELTA: ", delta)
                    return self.value + delta

            obj = MyClass(4)
            obj.stuff(5)

            print('Done.')
            """, run_in_function=False)

    def test_method_override(self):
        self.assertCodeExecution("""
            class MyObject:
                def __init__(self, x):
                    self.x = x

                def __str__(self):
                    return "Myobject instance %s" % self.x

            obj = MyObject(37)

            print(obj)
            print('Done.')
            """, run_in_function=False)

    @expectedFailure
    def test_getattr(self):
        self.assertCodeExecution("""
            class MyClass1:
                def __init__(self):
                    self.foo = 'bar'

                def __getattr__(self, name):
                    self.foo = 'foo_bar'
                    return name

            class MyClass2:
                def __init__(self):
                    self.x = 1

            class MyClass3:
                def __init__(self):
                    self.x = 42

            def g(instance, name):
                instance.x += 41
                return name

            MyClass2.__getattr__ = g
            obj1 = MyClass1()
            obj2 = MyClass2()
            obj3 = MyClass3()
            obj3.__getattr__ = g

            print(obj1.foo)
            print(obj1.fail)
            print(obj1.foo)

            print(obj2.x)
            print(obj2.fail)
            print(obj2.x)

            print(obj3.x)
            print(obj3.fail)
            print(obj3.x)
        """)

    @expectedFailure
    def test_getattribute(self):
        self.assertCodeExecution("""
            class MyClass1:
                def __init__(self):
                    self.x = 42
                    self.y = 41

                def __getattr__(self, attr):
                    print("That attribute doesn't exist")
                    return attr

                def __getattribute__(self, attr):
                    if attr in 'xy':
                        print("x or y")
                        val = object.__getattribute__(self, attr)
                    else:
                        print("something else")
                        val = object.__getattribute__(self, "fail")
                    return val

            class MyClass2:
                def __init__(self):
                    self.foo = 'bar'

            class MyClass3:
                def __init__(self):
                    self.foo = 7000

            def g(instance, name):
                if name == 'foo':
                    return object.__getattribute__(instance, 'foo')
                else:
                    return name

            MyClass2.__getattribute__ = g

            obj1 = MyClass1()
            obj2 = MyClass2()
            obj3 = MyClass3()
            obj3.__getattribute__ = g

            print(obj1.x)
            print(obj1.y)
            print(obj1.z)
            print(obj1.x)

            print(obj2.foo)
            print(obj2.fail)
            print(obj2.foo)

            print(obj3.foo)
            try:
                print(obj3.fail)
            except AttributeError:
                print("AttributeError")
            print(obj3.foo)
        """)

    def test_attributeerror(self):
        self.assertCodeExecution("""
            class MyClass:
                foo = 'bar'
                def __init__(self):
                    self.a = 42

            obj = MyClass()

            print(MyClass.foo)
            print(obj.a)
            print(obj.fail)
        """)

    def test_subclass(self):
        self.assertCodeExecution("""
            class MyBase:
                def __init__(self, x):
                    self.x = x

                def __str__(self):
                    return "Mybase instance %s" % self.x

                def first(self):
                    return self.x * 2


            class MyObject(MyBase):
                def __init__(self, x, y):
                    super().__init__(x)
                    self.y = y

                def __str__(self):
                    return "Myobject instance %s, %s" % (self.x, self.y)

                def second(self):
                    return self.x * self.y

            obj = MyObject(37, 42)

            print(obj)
            print(obj.x)
            print(obj.first())
            print(obj.y)
            print(obj.second())
            print('Done.')
            """)
