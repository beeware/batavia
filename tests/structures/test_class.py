from ..utils import TranspileTestCase

import unittest


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

    def test_getattr(self):
        self.assertCodeExecution("""
            class MyClass:
                def __init__(self):
                    self.x = 1

                def __getattr__(self, attr):
                    self.x = 42
                    return self.x+1

            obj = MyClass()
            print(obj.x)
            print(obj.fail)
            print(obj.x)
        """)

    def test_getattribute(self):
        self.assertCodeExecution("""
            class MyClass:
                def __init__(self):
                    self.x = 7

                def __getattr__(self, attr):
                    self.x = attr
                    return attr

                def __getattribute__(self, attr):
                    self.x = 42
                    return 42

            obj = MyClass()
            print(obj.x)
        """)

    def test_attributeerror(self):
        self.assertCodeExecution("""
            class MyClass:
                def __init__(self):
                    self.a = 42

            obj = MyClass()

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
