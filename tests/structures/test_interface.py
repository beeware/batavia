from ..utils import TranspileTestCase


class InterfaceTests(TranspileTestCase):

    def test_implement_interface(self):
        "You can implement (and use) a native Java interface"
        self.assertJavaExecution(
            """
            from java.lang import StringBuilder

            class MyStringAnalog(implements=java.lang.CharSequence):
                def __init__(self, value):
                    self.value = value

                def charAt(self, index: int) -> char:
                    return 'x'

                def length(self) -> int:
                    return len(self.value)

                def subSequence(self, start: int, end: int) -> java.lang.CharSequence:
                    return MyStringAnalog(self.value[start:end])

                def toString(self) -> java.lang.String:
                    return len(self.value) * 'x'

            analog = MyStringAnalog("world")

            builder = StringBuilder()

            builder.append("Hello, ")
            builder.append(analog)

            print(builder)
            print("Done.")
            """,
            """
            Hello, xxxxx
            Done.
            """, run_in_function=False)

    def test_implement_inner_interface(self):
        "You can implement (and use) a native Java interface defined as an inner class"
        self.assertJavaExecution(
            """
            from com.example import View

            class MyHandler(implements=com.example.View[Handler]):
                def event(self, view: com.example.View, name: java.lang.String) -> void:
                    print("My handler for a", name, "event on", view)

            view = View()

            handler = MyHandler()

            view.setHandler(handler)

            view.doEvent("Stuff");

            print("Done.")
            """,
            java={
                'com/example/View': """
                package com.example;

                public class View {
                    public static interface Handler {
                        public void event(View v, String event);
                    }

                    Handler handler;

                    public void setHandler(Handler h) {
                        System.out.println("Set handler to " + h);
                        this.handler = h;
                    }

                    public void doEvent(String name) {
                        System.out.println("Do event " + name);
                        this.handler.event(this, name);
                        System.out.println("Event done.");
                    }

                    public String toString() {
                        return "Java View";
                    }
                }
                """
            },
            out="""
            Set handler to <test.MyHandler object at 0xXXXXXXXX>
            Do event Stuff
            My handler for a Stuff event on Java View
            Event done.
            Done.
            """, run_in_function=False)
