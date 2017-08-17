from .. utils import TranspileTestCase, BuiltinTwoargFunctionTestCase


class HasattrTests(TranspileTestCase):
    def test_minimal(self):
        self.assertCodeExecution("""
            class MyClass(object):
                class_value = 42

                def __init__(self, val):
                    self.value = val

                def stuff(self, delta):
                    print("DELTA: ", delta)
                    return self.value + delta

            print("On class: ")
            print('MyClass.foo', hasattr(MyClass, 'foo'))
            print('MyClass.value', hasattr(MyClass, 'value'))
            print('MyClass.class_value', hasattr(MyClass, 'class_value'))
            print('MyClass.stuff', hasattr(MyClass, 'stuff'))

            obj = MyClass(37)

            print("On instance:")
            print('obj.foo', hasattr(obj, 'foo'))
            print('obj.value', hasattr(obj, 'value'))
            print('obj.class_value', hasattr(obj, 'class_value'))
            print('obj.stuff', hasattr(obj, 'stuff'))

            print('Done.')
            """, run_in_function=False)


class BuiltinHasattrFunctionTests(BuiltinTwoargFunctionTestCase, TranspileTestCase):
    function = "hasattr"

    not_implemented = [
        'test_list_str',
        'test_str_str',
        'test_tuple_str',
    ]
