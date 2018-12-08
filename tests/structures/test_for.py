from ..utils import TranspileTestCase

import unittest


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

    def test_for_over_iterable_object(self):

        self.assertCodeExecution("""
            class Test:
                class TestIterator:
                    def __init__(self, l):
                        self.l = l
                        self.i = 0
                    def __iter__(self):
                        return self
                    def __next__(self):
                        if self.i >= len(self.l):
                            raise StopIteration
                        self.i += 1
                        return self.l[self.i - 1]
                def __init__(self, l):
                    self.l = l
                def __iter__(self):
                    return self.TestIterator(self.l)
            t = Test([1 ,2, 3, 5])

            total = 0
            for i in iter(t):
                total = total + i
                print(i, total)
            print('Done.')
            """)

        self.assertCodeExecution("""
            class Test:
                def __init__(self, l):
                    self.l = l
                def __len__(self):
                    return len(self.l)
                def __getitem__(self, index):
                    return self.l[index]
            t = Test([1 ,2, 3, 6])

            total = 0
            for i in t:
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
