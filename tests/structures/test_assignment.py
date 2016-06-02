from ..utils import TranspileTestCase


class AssignmentTests(TranspileTestCase):
    def test_simple_assignment(self):
        self.assertCodeExecution("""
            x = 42
            print(x)
            print('Done.')
            """)

    def test_multiple_assignment(self):
        self.assertCodeExecution("""
            x = y = 42
            print(x, y)
            print('Done.')
            """)

    def test_old_style_conditional_assignment(self):
        self.assertCodeExecution("""
            x = 42
            y = x or 37
            print(y)
            x = 0
            y = x or 37
            print(y)
            print('Done.')
            """)

    def test_conditional_assignment(self):
        self.assertCodeExecution("""
            x = 42
            y = 99 if x else 37
            print(y)
            x = 0
            y = 99 if x else 37
            print(y)
            print('Done.')
            """)

    def test_access_potentially_unassigned(self):
        self.assertCodeExecution("""
            x = 37
            if x > 0:
                y = 42
            print(y)
            print('Done.')
            """)

    def test_use_potentially_unassigned(self):
        self.assertCodeExecution("""
            x = 37
            if y > 0:
                print("Yes")
            else:
                print("No")
            print('Done.')
            """)
