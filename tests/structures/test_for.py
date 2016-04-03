from ..utils import TranspileTestCase


class ForLoopTests(TranspileTestCase):
    def test_for_over_range(self):
        # Normal range
        self.assertCodeExecution("""
            total = 0
            for i in range(0, 5):
                total = total + i
                print(i, total)
            print('Done.')
            """)

        # Empty range
        self.assertCodeExecution("""
              total = 0
              for i in range(0, 0):
                  total = total + i
                  print(i, total)
              print('Done.')
              """)

        # Stepped range
        self.assertCodeExecution("""
              total = 0
              for i in range(0, 10, 2):
                  total = total + i
                  print(i, total)
              print('Done.')
              """)

        # Reverse range
        self.assertCodeExecution("""
              total = 0
              for i in range(5, 0, -1):
                  total = total + i
                  print(i, total)
              print('Done.')
              """)

    def test_for_over_iterable(self):
        self.assertCodeExecution("""
            total = 0
            for i in [1, 2, 3, 5]:
                total = total + i
                print(i, total)
            print('Done.')
            """)

        self.assertCodeExecution("""
            total = 0
            for i in []:
                total = total + i
                print(i, total)
            print('Done.')
            """)

    # def test_for_else(self):
    #     self.assertCodeExecution(
    #         code="""
    #             total = 0
    #             for i in []:
    #                 total = total + i
    #             else:
    #                 total = -999
    #             """,
    #         expected="""
    #          Code (159 bytes)
    #         """)

    def test_break(self):
        self.assertCodeExecution(
            code="""
                for i in range(1, 10):
                    print(i, i % 5)
                    if i % 5 == 0:
                        break
                    print ("after")
                print("Done")
            """)

    def test_continue(self):
        self.assertCodeExecution(
            code="""
                for i in range(1, 10):
                    print(i, i % 5)
                    if i % 5 == 0:
                        continue
                    print ("after")
                print("Done")
            """)

    def test_nested(self):
        self.assertCodeExecution(
            code="""
                i = 1
                j = 10
                for i in range(1, 10):
                    for k in range(0, i):
                        print(i, j)
                print("Done")
            """)
