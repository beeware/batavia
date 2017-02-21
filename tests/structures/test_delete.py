from ..utils import TranspileTestCase


class DeleteTests(TranspileTestCase):
    def test_delete_from_dict(self):
        self.assertCodeExecution("""
            x = {'a': 1, 'b': 2}

            print(" Delete 'a'...")
            del x['a']
            print('x =', x)

            try:
                print(" Delete 'a'...")
                del x['a']
                print("Key 'a' shouldn't exist")
            except KeyError:
                print("Key 'a' doesn't exist")
            print('x =', x)

            try:
                print(" Delete 'c'...")
                del x['c']
                print("Key 'c' never existed")
            except KeyError:
                print("Key 'c' doesn't exist")
            print('x =', x)

            print("Done.")
            """)

    def test_delete_from_list(self):
        self.assertCodeExecution("""
            x = [1, 2, 3, 4, 5, 6]

            print("x =", x)

            print("Delete index 2...")
            del x[2]
            print("x =", x)

            print("Delete index -1...")
            del x[-1]
            print("x =", x)

            try:
                print("Delete index 10...")
                del x[10]
                print("Index shouldn't exist")
            except IndexError:
                print("Index doesn't exist")

            print("x =", x)

            print("Done.")
            """)

    def test_delete_attribute(self):
        self.assertCodeExecution("""
            class MyObject:
                def __init__(self):
                    self.attr1 = 123

            obj = MyObject()

            obj.attr2 = 456
            print('obj.attr1 =', obj.attr1)
            print('obj.attr2 =', obj.attr2)

            print("Delete attributes...")
            del obj.attr1
            del obj.attr2

            print("Access deleted attributes...")
            try:
                print('obj.attr1 = ', obj.attr1)
                print("obj.attr1 shouldn't exist")
            except AttributeError:
                print("obj.attr1 doesn't exist")

            try:
                print('obj.attr2 = ', obj.attr2)
                print("obj.attr2 shouldn't exist")
            except AttributeError:
                print("obj.attr2 doesn't exist")

            print("Delete deleted attributes...")
            try:
                del obj.attr1
                print("obj.attr1 shouldn't exist")
            except AttributeError:
                print("obj.attr1 doesn't exist")

            try:
                del obj.attr2
                print("obj.attr2 shouldn't exist")
            except AttributeError:
                print("obj.attr2 doesn't exist")

            print("Delete non-existent attribute...")
            try:
                del obj.no_such_attr
                print("obj.no_such_attr never existed")
            except AttributeError:
                print("obj.no_such_attr doesn't exist")

            print("Done.")
            """)
