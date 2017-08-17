from .. utils import TranspileTestCase, BuiltinTwoargFunctionTestCase


class GetattrTests(TranspileTestCase):
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
            print('  class_value =', getattr(MyClass, 'class_value'))
            # print('  stuff =', getattr(MyClass, 'stuff'))  # FIXME
            try:
                getattr(MyClass, 'foo')
                print("  Shouldn't be able to get attribute foo")
            except AttributeError:
                print("  Can't get attribute foo")
            print('  foo (default) =', getattr(MyClass, 'foo', 42))

            obj = MyClass(37)

            print("On instance:")
            print('  class_value =', getattr(obj, 'class_value'))
            print('  value =', getattr(obj, 'value'))
            # print('  stuff =', getattr(obj, 'stuff'))  # FIXME
            try:
                getattr(MyClass, 'foo')
                print("  Shouldn't be able to get attribute foo")
            except AttributeError:
                print("  Can't get attribute foo")
            print('  foo (default) =', getattr(obj, 'foo', 42))

            print('Done.')
            """, run_in_function=False)


class BuiltinGetattrFunctionTests(BuiltinTwoargFunctionTestCase, TranspileTestCase):
    function = "getattr"

    not_implemented = [
        'test_list_str',
        'test_str_str',
        'test_tuple_str',
    ]
