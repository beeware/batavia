from ..utils import TranspileTestCase


class SetComprehensionTests(TranspileTestCase):
    def test_syntax(self):
        self.assertCodeExecution("""
            x = [1, 2, 3, 4, 5]
            s = {v**2 for v in x}
            print(len(s))
            print(1 in s)
            print(4 in s)
            print(9 in s)
            print(16 in s)
            print(25 in s)
            print('Done.')
            """)

    def test_method(self):
        self.assertCodeExecution("""
            x = [1, 2, 3, 4, 5]
            s = set(v**2 for v in x)
            print(len(s))
            print(1 in s)
            print(4 in s)
            print(9 in s)
            print(16 in s)
            print(25 in s)
            print('Done.')
            """)
