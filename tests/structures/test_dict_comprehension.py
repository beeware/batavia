from ..utils import TranspileTestCase


class DictComprehensionTests(TranspileTestCase):
    def test_syntax(self):
        self.assertCodeExecution("""
            x = [1, 2, 3, 4, 5]
            d = {v: v**2 for v in x}
            print(len(d))
            print(d[1])
            print(d[2])
            print(d[3])
            print(d[4])
            print(d[5])
            print('Done.')
            """)

    def test_method(self):
        self.assertCodeExecution("""
            x = [1, 2, 3, 4, 5]
            d = dict((v, v**2) for v in x)
            print(len(d))
            print(d[1])
            print(d[2])
            print(d[3])
            print(d[4])
            print(d[5])
            print('Done.')
            """)
