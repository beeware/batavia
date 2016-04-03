from unittest import expectedFailure

from ..utils import TranspileTestCase


class JavaTests(TranspileTestCase):

    def test_multiple_constructors(self):
        "The appropriate constructor for a native Java class can be interpolated from args"
        self.assertJavaExecution(
            """
            from java.lang import StringBuilder

            builder = StringBuilder("Hello, ")

            builder.append("world")

            print(builder)
            print("Done.")
            """,
            """
            Hello, world
            Done.
            """, run_in_function=False)

    def test_most_specific_constructor(self):
        "The most specific constructor for a native Java class will be selected based on argument."
        self.assertJavaExecution(
            """
            from com.example import MyClass

            obj1 = MyClass()
            obj2 = MyClass(1.234)
            obj3 = MyClass(3742)

            print("Done.")
            """,
            java={
                'com/example/MyClass': """
                package com.example;

                public class MyClass {
                    public MyClass() {
                        System.out.println("No argument");
                    }

                    public MyClass(int arg) {
                        System.out.println("Integer argument " + arg);
                    }

                    public MyClass(double arg) {
                        System.out.println("Double argument " + arg);
                    }
                }
                """
            },
            out="""
            No argument
            Double argument 1.234
            Integer argument 3742
            Done.
            """, run_in_function=False)

    def test_field(self):
        "Native fields on an instance can be accessed"
        self.assertJavaExecution("""
                from com.example import MyClass

                print("Class is", MyClass)
                obj1 = MyClass()
                print("Field is", MyClass.field)
                print("Field from instance is", obj1.field)
                obj1.field = 37
                print("Updated Field from instance is", obj1.field)
                print("Done.")
                """,
            java={
                'com/example/MyClass': """
                package com.example;

                public class MyClass {
                    public int field = 42;
                }
                """
            },
            out="""
                Class is <class 'com.example.MyClass'>
                Field is <unbound native field public int com.example.MyClass.field>
                Field from instance is 42
                Updated Field from instance is 37
                Done.
                """)

    def test_static_field(self):
        "Class constants can be accessed"
        self.assertJavaExecution("""
                from com.example import MyClass

                print("Class is", MyClass)
                obj1 = MyClass()
                print("Static field is", MyClass.static_field)
                MyClass.static_field = 37
                print("Updated static field is", MyClass.static_field)
                print("Static field from instance is", obj1.static_field)
                MyClass.static_field = 42
                print("Updated static field from instance is", obj1.static_field)
                print("Done.")
                """,
            java={
                'com/example/MyClass': """
                package com.example;

                public class MyClass {
                    public static int static_field = 42;
                }
                """
            },
            out="""
                Class is <class 'com.example.MyClass'>
                Static field is 42
                Updated static field is 37
                Static field from instance is 37
                Updated static field from instance is 42
                Done.
                """)

    def test_superclass_field(self):
        "Native fields defined on a superclass can be accessed"
        self.assertJavaExecution("""
                from com.example import MyBase, MyClass

                print("Base class is", MyBase)
                print("Class is", MyClass)
                obj1 = MyClass()
                print("Base field on superclass is", MyBase.base_field)
                print("Base field is", MyClass.base_field)
                print("Base field from instance is", obj1.base_field)
                print("Field is", MyClass.field)
                print("Field from instance is", obj1.field)
                print("Done.")
                """,
            java={
                'com/example/MyBase': """
                package com.example;

                public class MyBase {
                    public int base_field = 37;
                }
                """,
                'com/example/MyClass': """
                package com.example;

                public class MyClass extends MyBase {
                    public int field = 42;
                }
                """
            },
            out="""
                Base class is <class 'com.example.MyBase'>
                Class is <class 'com.example.MyClass'>
                Base field on superclass is <unbound native field public int com.example.MyBase.base_field>
                Base field is <unbound native field public int com.example.MyBase.base_field>
                Base field from instance is 37
                Field is <unbound native field public int com.example.MyClass.field>
                Field from instance is 42
                Done.
                """)

    def test_superclass_static_field(self):
        "Native static fields defined on a superclass can be accessed"
        self.assertJavaExecution("""
                from com.example import MyBase, MyClass

                print("Base class is", MyBase)
                print("Class is", MyClass)
                obj1 = MyClass()
                print("Static base field on superclass is", MyBase.base_static_field)
                print("Static base field is", MyClass.base_static_field)
                print("Static base field from instance is", obj1.base_static_field)
                print("Static field is", MyClass.static_field)
                print("Static field from instance is", obj1.static_field)
                print("Done.")
                """,
            java={
                'com/example/MyBase': """
                package com.example;

                public class MyBase {
                    public static int base_static_field = 37;
                }
                """,
                'com/example/MyClass': """
                package com.example;

                public class MyClass extends MyBase {
                    public static int static_field = 42;
                }
                """
            },
            out="""
                Base class is <class 'com.example.MyBase'>
                Class is <class 'com.example.MyClass'>
                Static base field on superclass is 37
                Static base field is 37
                Static base field from instance is 37
                Static field is 42
                Static field from instance is 42
                Done.
                """)

    def test_constant(self):
        "Instance constants can be accessed"
        self.assertJavaExecution("""
                from com.example import MyClass

                print("Class is", MyClass)
                obj1 = MyClass()
                print("Constant is", MyClass.CONSTANT)
                print("Constant from instance is", obj1.CONSTANT)
                print("Done.")
                """,
            java={
                'com/example/MyClass': """
                package com.example;

                public class MyClass {
                    public final int CONSTANT = 42;
                }
                """
            },
            out="""
                Class is <class 'com.example.MyClass'>
                Constant is <unbound native field public final int com.example.MyClass.CONSTANT>
                Constant from instance is 42
                Done.
                """)

    def test_static_constant(self):
        "Class constants can be accessed"
        self.assertJavaExecution("""
                from com.example import MyClass

                print("Class is", MyClass)
                obj1 = MyClass()
                print("Static constant is", MyClass.STATIC_CONSTANT)
                print("Static constant from instance is", obj1.STATIC_CONSTANT)
                print("Done.")
                """,
            java={
                'com/example/MyClass': """
                package com.example;

                public class MyClass {
                    public static final int STATIC_CONSTANT = 42;
                }
                """
            },
            out="""
                Class is <class 'com.example.MyClass'>
                Static constant is 42
                Static constant from instance is 42
                Done.
                """)

    def test_method(self):
        "Native methods on an instance can be accessed"
        self.assertJavaExecution("""
                from com.example import MyClass

                print("Class is", MyClass)
                obj = MyClass()
                print("Method is", MyClass.method)
                print("Method from instance is", obj.method)
                obj.method()
                print("Done.")
                """,
            java={
                'com/example/MyClass': """
                package com.example;

                public class MyClass {
                    public void method() {
                        System.out.println("Hello from the instance!");
                    }
                }
                """
            },
            out="""
                Class is <class 'com.example.MyClass'>
                Method is <native function com.example.MyClass.method>
                Method from instance is <bound native method com.example.MyClass.method of <Native class com.example.MyClass object at 0xXXXXXXXX>>
                Hello from the instance!
                Done.
                """)

    def test_static_method(self):
        "Native static methods on an instance can be accessed"
        self.assertJavaExecution("""
                from com.example import MyClass

                print("Class is", MyClass)
                obj = MyClass()
                print("Static method is", MyClass.method)
                MyClass.method()
                print("Static method from instance is", obj.method)
                obj.method()
                print("Done.")
                """,
            java={
                'com/example/MyClass': """
                package com.example;

                public class MyClass {
                    public static void method() {
                        System.out.println("Hello from the class!");
                    }
                }
                """
            },
            out="""
                Class is <class 'com.example.MyClass'>
                Static method is <native function com.example.MyClass.method>
                Hello from the class!
                Static method from instance is <bound native method com.example.MyClass.method of <Native class com.example.MyClass object at 0xXXXXXXXX>>
                Hello from the class!
                Done.
                """)

    def test_superclass_method(self):
        "Native methods defined on a superclass can be accessed"
        self.assertJavaExecution("""
                from com.example import MyBase, MyClass

                print("Base class is", MyBase)
                print("Class is", MyClass)

                print("Base method on superclass is", MyBase.base_method)
                print("Method on superclass is", MyBase.method)

                print("Base method is", MyClass.base_method)
                print("Method is", MyClass.method)

                obj1 = MyBase()
                print("Base method from superclass instance is", obj1.base_method)
                obj1.base_method()
                print("Method from superclass instance is", obj1.method)
                obj1.method()

                obj2 = MyClass()
                print("Base method from instance is", obj2.base_method)
                obj2.base_method()
                print("Method from instance is", obj2.method)
                obj2.method()
                print("Done.")
                """,
            java={
                'com/example/MyBase': """
                package com.example;

                public class MyBase {
                    public void base_method() {
                        System.out.println("Hello from the base!");
                    }

                    public void method() {
                        System.out.println("Goodbye from the base!");
                    }
                }
                """,
                'com/example/MyClass': """
                package com.example;

                public class MyClass extends MyBase {
                    public void method() {
                        System.out.println("Hello from the instance!");
                    }
                }
                """
            },
            out="""
                Base class is <class 'com.example.MyBase'>
                Class is <class 'com.example.MyClass'>
                Base method on superclass is <native function com.example.MyBase.base_method>
                Method on superclass is <native function com.example.MyBase.method>
                Base method is <native function com.example.MyBase.base_method>
                Method is <native function com.example.MyClass.method>
                Base method from superclass instance is <bound native method com.example.MyBase.base_method of <Native class com.example.MyBase object at 0xXXXXXXXX>>
                Hello from the base!
                Method from superclass instance is <bound native method com.example.MyBase.method of <Native class com.example.MyBase object at 0xXXXXXXXX>>
                Goodbye from the base!
                Base method from instance is <bound native method com.example.MyBase.base_method of <Native class com.example.MyClass object at 0xXXXXXXXX>>
                Hello from the base!
                Method from instance is <bound native method com.example.MyClass.method of <Native class com.example.MyClass object at 0xXXXXXXXX>>
                Hello from the instance!
                Done.
                """)

    def test_superclass_static_method(self):
        "Native static methods defined on a superclass can be accessed"
        self.assertJavaExecution("""
                from com.example import MyBase, MyClass

                print("Base class is", MyBase)
                print("Class is", MyClass)

                print("Static base method on superclass is", MyBase.base_static_method)
                MyBase.base_static_method()
                print("Static method on superclass is", MyBase.static_method)
                MyBase.static_method()

                print("Static base method is", MyClass.base_static_method)
                MyClass.base_static_method()
                print("Static method is", MyClass.static_method)
                MyClass.static_method()

                obj1 = MyBase()
                print("Base static method from superclass instance is", obj1.base_static_method)
                obj1.base_static_method()
                print("Static method from superclass instance is", obj1.static_method)
                obj1.static_method()

                obj2 = MyClass()
                print("Base static method from instance is", obj2.base_static_method)
                obj2.base_static_method()
                print("Static method from instance is", obj2.static_method)
                obj2.static_method()
                print("Done.")
                """,
            java={
                'com/example/MyBase': """
                package com.example;

                public class MyBase {
                    public static void base_static_method() {
                        System.out.println("Hello from the base!");
                    }

                    public static void static_method() {
                        System.out.println("Goodbye from the base!");
                    }
                }
                """,
                'com/example/MyClass': """
                package com.example;

                public class MyClass extends MyBase {
                    public static void static_method() {
                        System.out.println("Hello from the class!");
                    }
                }
                """
            },
            out="""
                Base class is <class 'com.example.MyBase'>
                Class is <class 'com.example.MyClass'>
                Static base method on superclass is <native function com.example.MyBase.base_static_method>
                Hello from the base!
                Static method on superclass is <native function com.example.MyBase.static_method>
                Goodbye from the base!
                Static base method is <native function com.example.MyBase.base_static_method>
                Hello from the base!
                Static method is <native function com.example.MyClass.static_method>
                Hello from the class!
                Base static method from superclass instance is <bound native method com.example.MyBase.base_static_method of <Native class com.example.MyBase object at 0xXXXXXXXX>>
                Hello from the base!
                Static method from superclass instance is <bound native method com.example.MyBase.static_method of <Native class com.example.MyBase object at 0xXXXXXXXX>>
                Goodbye from the base!
                Base static method from instance is <bound native method com.example.MyBase.base_static_method of <Native class com.example.MyClass object at 0xXXXXXXXX>>
                Hello from the base!
                Static method from instance is <bound native method com.example.MyClass.static_method of <Native class com.example.MyClass object at 0xXXXXXXXX>>
                Hello from the class!
                Done.
                """)

    def test_inner_class_constant(self):
        "Constants on an inner class can be accessed"
        self.assertJavaExecution("""
                from com.example import OuterClass

                print("Outer class is", OuterClass)
                print("Outer constant is", OuterClass.OUTER_CONSTANT)

                print("Inner class is", OuterClass.InnerClass)
                print("Inner constant is", OuterClass.InnerClass.INNER_CONSTANT)

                print("Done.")
                """,
            java={
                'com/example/OuterClass': """
                package com.example;

                public class OuterClass {
                    public static final int OUTER_CONSTANT = 42;

                    public static class InnerClass {
                        public static final int INNER_CONSTANT = 37;
                    }
                }
                """
            },
            out="""
                Outer class is <class 'com.example.OuterClass'>
                Outer constant is 42
                Inner class is <class 'com.example.OuterClass$InnerClass'>
                Inner constant is 37
                Done.
                """)

    def test_inner_class_method(self):
        "Inner classes can be instantiated, and methods invoked"
        self.assertJavaExecution("""
                from com.example import OuterClass

                print("Outer class is", OuterClass)
                obj1 = OuterClass()
                obj1.method()

                print("Inner class is", OuterClass.InnerClass)
                obj2 = OuterClass.InnerClass(obj1)
                obj2.method()

                print("Done.")
                """,
            java={
                'com/example/OuterClass': """
                package com.example;

                public class OuterClass {
                    public class InnerClass {
                        public void method() {
                            System.out.println("Hello from the inside!");
                        }
                    }

                    public void method() {
                        System.out.println("Hello from the outside!");
                    }
                }
                """
            },
            out="""
                Outer class is <class 'com.example.OuterClass'>
                Hello from the outside!
                Inner class is <class 'com.example.OuterClass$InnerClass'>
                Hello from the inside!
                Done.
                """)


    def test_static_inner_class_constant(self):
        "Constants on a static inner class can be accessed"
        self.assertJavaExecution("""
                from com.example import OuterClass

                print("Outer class is", OuterClass)
                print("Outer constant is", OuterClass.OUTER_CONSTANT)

                print("Inner class is", OuterClass.InnerClass)
                print("Inner constant is", OuterClass.InnerClass.INNER_CONSTANT)

                print("Done.")
                """,
            java={
                'com/example/OuterClass': """
                package com.example;

                public class OuterClass {
                    public static final int OUTER_CONSTANT = 42;

                    public static class InnerClass {
                        public static final int INNER_CONSTANT = 37;
                    }
                }
                """
            },
            out="""
                Outer class is <class 'com.example.OuterClass'>
                Outer constant is 42
                Inner class is <class 'com.example.OuterClass$InnerClass'>
                Inner constant is 37
                Done.
                """)

    def test_static_inner_class_method(self):
        "Static inner classes can be instantiated, and methods invoked"
        self.assertJavaExecution("""
                from com.example import OuterClass

                print("Outer class is", OuterClass)
                obj1 = OuterClass()
                obj1.method()

                print("Inner class is", OuterClass.InnerClass)
                obj2 = OuterClass.InnerClass()
                obj2.method()

                print("Done.")
                """,
            java={
                'com/example/OuterClass': """
                package com.example;

                public class OuterClass {
                    public static class InnerClass {
                        public void method() {
                            System.out.println("Hello from the inside!");
                        }
                    }

                    public void method() {
                        System.out.println("Hello from the outside!");
                    }
                }
                """
            },
            out="""
                Outer class is <class 'com.example.OuterClass'>
                Hello from the outside!
                Inner class is <class 'com.example.OuterClass$InnerClass'>
                Hello from the inside!
                Done.
                """)
