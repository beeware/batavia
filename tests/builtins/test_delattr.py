from .. utils import TranspileTestCase, BuiltinTwoargFunctionTestCase


class DelattrTests(TranspileTestCase):
    def test_minimal(self):
        self.assertCodeExecution("""
            class MyClass(object):
                class_value = 42

                def __init__(self, val):
                    self.value = val

            print("On class: ")
            delattr(MyClass, 'class_value')
            try:
                print('  class_value =', MyClass.class_value)
                print("  Shouldn't be able to get attribute class_value")
            except AttributeError:
                print("  Can't get attribute class_value")

            try:
                delattr(MyClass, 'class_value')
                print("  Shouldn't be able to delete attribute class_value")
            except AttributeError:
                print("  Can't delete attribute class_value")

            try:
                delattr(MyClass, 'other_class_value')
                print("  Shouldn't be able to delete attribute other_class_value")
            except AttributeError:
                print("  Can't delete attribute other_class_value")

            obj = MyClass(37)

            print("On instance:")
            delattr(obj, 'value')
            try:
                print('  value =', MyClass.value)
                print("  Shouldn't be able to get attribute value")
            except AttributeError:
                print("  Can't get attribute value")

            try:
                delattr(obj, 'value')
                print("  Shouldn't be able to delete attribute value")
            except AttributeError:
                print("  Can't delete attribute value")

            try:
                delattr(obj, 'other_value')
                print("  Shouldn't be able to delete attribute other_value")
            except AttributeError:
                print("  Can't delete attribute other_value")

            print('Done.')
            """, run_in_function=False)


class BuiltinDelattrFunctionTests(BuiltinTwoargFunctionTestCase, TranspileTestCase):
    function = "delattr"
