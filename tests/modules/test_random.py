from ..utils import ModuleFunctionTestCase, TranspileTestCase


class RandomTests(ModuleFunctionTestCase, TranspileTestCase):
    def test_BPF(self):
        self.assertCodeExecution("""
            import random
            print(random.BPF)
            """)

    def test_LOG4(self):
        self.assertCodeExecution("""
            import random
            print(random.LOG4)
            """)

    def test_NV_MAGICCONST(self):
        self.assertCodeExecution("""
            import random
            print(random.NV_MAGICCONST)
            """)

    def test_RECIP_BPF(self):
        self.assertCodeExecution("""
            import random
            print(random.RECIP_BPF)
            """)

    def test_SG_MAGICCONST(self):
        self.assertCodeExecution("""
            import random
            print(random.SG_MAGICCONST)
            """)

    def test_TWOPI(self):
        self.assertCodeExecution("""
            import random
            print(random.TWOPI)
            """)

    def test__e(self):
        self.assertCodeExecution("""
            import random
            print(random._e)
            """)

    def test__pi(self):
        self.assertCodeExecution("""
            import random
            print(random._pi)
            """)

    def test__acos(self):
        self.assertCodeExecution("""
            import random
            print(random._acos(0.5))
            """)

    def test__ceil(self):
        self.assertCodeExecution("""
            import random
            print(random._ceil(0.5))
            """)

    def test__cos(self):
        self.assertCodeExecution("""
            import random
            print(random._cos(0.5))
            """)

    def test__exp(self):
        self.assertCodeExecution("""
            import random
            print(random._exp(5.9))
            """)

    def test__log(self):
        self.assertCodeExecution("""
            import random
            print(random._log(random._e))
            print(random._log(2, 2))
            print(random._log(89, 34.2))
            print(random._log(3, 9))
            """)

    def test__sin(self):
        self.assertCodeExecution("""
            import random
            print(random._sin(0.5))
            """)

    def test__sqrt(self):
        self.assertCodeExecution("""
            import random
            print(random._sqrt(0.5))
            print(random._sqrt(100))
            print(random._sqrt(-1))
            """)

    def test_choice(self):
        self.assertCodeExecution("""
            import random
            foo = [1, 2, 3, 'foo', 'bar', 'baz']
            bar = random.choice(foo)
            is_in = False
            for i in foo:
                if foo[i] == bar:
                    is_in = True
            print(is_in)
            """)

    def test_randint(self):
        self.assertCodeExecution("""
            import random
            foo = random.randint(0, 5)
            print(a >= 0)
            print(a <= 5)
            """)

    def test_random(self):
        self.assertCodeExecution("""
            import random
            foo = random.random()
            print(a >= 0)
            print(a < 1)
            """)
