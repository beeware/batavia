from ..utils import TranspileTestCase


class WhileLoopTests(TranspileTestCase):
    def test_while(self):
        self.assertCodeExecution("""
            i = 0
            total = 0
            while i < 10:
                i += 1
                total += i
                print(i, total)
            print('Done.')
            """)

    def test_break(self):
        self.assertCodeExecution(
            code="""
                i = 0
                while i < 10:
                    i = i + 1
                    print(i, i % 5)
                    if i % 5 == 0:
                        break
                    print("after")
                print("Done")
            """)

    def test_continue(self):
        self.assertCodeExecution(
            code="""
                i = 0
                while i < 10:
                    i = i + 1
                    print(i, i % 5)
                    if i % 5 == 0:
                        continue
                    print("after")
                print("Done")
            """)

    def test_nested(self):
        self.assertCodeExecution(
            code="""
                i = 1
                j = 10
                while i < j:
                    k = 0
                    while k < i:
                        print(i, j)
                        k = k + 1
                    print("While done")
                    i = i + 1
                print("Done")
            """)

    def test_while_forever(self):
        self.assertCodeExecution(
            code="""
                i = 0
                while 1:
                    print("Loop", i)
                    i = i + 1
                    if i == 10:
                        break
                print("Done")
            """)
