from ..utils import TranspileTestCase


class ExtendsTests(TranspileTestCase):
    def test_extends(self):
        self.assertJavaExecution(
            """
            from java.util import HashMap

            class MyHashMap(extends=java.util.HashMap):
                def push_button(self):
                    return "Bing!"

                def put(self, key: java.lang.Object, value: java.lang.Object) -> java.lang.Object:
                    print("I WANT TO SET", key, "TO", value)
                    return super().put(key, value)

            mymap = MyHashMap()
            print(mymap)
            mymap.put("The answer", "42")
            print(mymap)
            print("The answer is", mymap.get("The answer"))
            print("The question is", mymap.get("The question"))
            print("The machine goes " + mymap.push_button())
            print("Done.")
            """,
            """
            {}
            I WANT TO SET The answer TO 42
            {The answer=42}
            The answer is 42
            The question is None
            The machine goes Bing!
            Done.
            """, run_in_function=False)
