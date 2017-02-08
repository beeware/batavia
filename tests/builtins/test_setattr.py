from .. utils import TranspileTestCase


class SetattrTests(TranspileTestCase):
    def test_minimal(self):
        self.assertCodeExecution("""
            class MyClass(object):
                class_value = 42

                def __init__(self, val):
                    self.value = val

            print("On class: ")
            setattr(MyClass, 'class_value', 37)
            setattr(MyClass, 'other_class_value', 42)
            print('  class_value =', MyClass.class_value)
            print('  other_class_value =', MyClass.other_class_value)

            obj = MyClass(37)

            print("On instance:")
            setattr(obj, 'value', 37)
            setattr(obj, 'other_value', 42)
            print('  value =', obj.value)
            print('  other_value =', obj.other_value)

            print('Done.')
            """, run_in_function=False)
