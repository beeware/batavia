# coding=utf-8
from ..utils import TranspileTestCase
from unittest import expectedFailure

class ClassBinaryOpsDataModelTests(TranspileTestCase):
    def test_add(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __add__(self, other):
                    x = self.x + other.x
                    y = self.y + other.y
                    return Pair(x, y)

            p1 = Pair(5, 6)
            p2 = Pair(9, 4)

            print(p1 + p2)
        """, run_in_function=False)

    def test_subtract(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __sub__(self, other):
                    x = self.x - other.x
                    y = self.y - other.y
                    return Pair(x, y)

            p1 = Pair(5, 6)
            p2 = Pair(9, 4)

            print(p1 - p2)
        """, run_in_function=False)

    def test_multiply(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __mul__(self, other):
                    x = self.x * other
                    y = self.y * other
                    return Pair(x, y)

            p1 = Pair(5, 6)
            num = 4

            print(p1 * num)
        """, run_in_function=False)

    def test_truedivision(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __truediv__(self, other):
                    x = self.x / other
                    y = self.y / other
                    return Pair(x, y)

            p1 = Pair(5, 6)
            num = 4

            print(p1 / num)
        """, run_in_function=False)

    def test_floordivision(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __floordiv__(self, other):
                    x = self.x // other
                    y = self.y // other
                    return Pair(x, y)

            p1 = Pair(5, 6)
            num = 4

            print(p1 // num)
        """, run_in_function=False)

    def test_mod(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __mod__(self, other):
                    x = self.x % other
                    y = self.y % other
                    return Pair(x, y)

            p1 = Pair(5, 6)
            num = 4

            print(p1 % num)
        """, run_in_function=False)

    def test_pow(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __pow__(self, other):
                    x = self.x ** other
                    y = self.y ** other
                    return Pair(x, y)

            p1 = Pair(5, 6)
            num = 4

            print(p1 ** num)
        """, run_in_function=False)

    def test_lshift(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __lshift__(self, other):
                    x = self.x << other
                    y = self.y << other
                    return Pair(x, y)

            p1 = Pair(5, 6)
            num = 4

            print(p1 << num)
        """, run_in_function=False)

    def test_rshift(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __rshift__(self, other):
                    x = self.x >> other
                    y = self.y >> other
                    return Pair(x, y)

            p1 = Pair(5, 6)
            num = 4

            print(p1 >> num)
        """, run_in_function=False)

    def test_and(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __and__(self, other):
                    x = self.x & other.x
                    y = self.y & other.y
                    return Pair(x, y)

            p1 = Pair(5, 6)
            p2 = Pair(6, 5)

            print(p1 & p2)
        """, run_in_function=False)

    def test_xor(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __xor__(self, other):
                    x = self.x ^ other.x
                    y = self.y ^ other.y
                    return Pair(x, y)

            p1 = Pair(5, 6)
            p2 = Pair(6, 5)

            print(p1 ^ p2)
        """, run_in_function=False)

    def test_or(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __or__(self, other):
                    x = self.x | other.x
                    y = self.y | other.y
                    return Pair(x, y)

            p1 = Pair(5, 6)
            p2 = Pair(6, 5)

            print(p1 | p2)
        """, run_in_function=False)


class ClassInPlaceOpsDataModelTests(TranspileTestCase):
    def test_iadd(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __iadd__(self, other):
                    self.x += other.x
                    self.y += other.y
                    return self

            p1 = Pair(5, 6)
            p1 += Pair(9, 4)

            print(p1)
        """, run_in_function=False)

    def test_isubtract(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __isub__(self, other):
                    self.x -= other.x
                    self.y -= other.y
                    return self

            p1 = Pair(5, 6)
            p1 -= Pair(9, 4)

            print(p1)
        """, run_in_function=False)

    def test_imultiply(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __imul__(self, other):
                    self.x *= other
                    self.y *= other
                    return self

            p1 = Pair(5, 6)
            p1 *= 4

            print(p1)
        """, run_in_function=False)

    def test_itruedivision(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __itruediv__(self, other):
                    self.x /= other
                    self.y /= other
                    return self

            p1 = Pair(5, 6)
            p1 /=4

            print(p1)
        """, run_in_function=False)

    def test_ifloordivision(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __ifloordiv__(self, other):
                    self.x //= other
                    self.y //= other
                    return self

            p1 = Pair(5, 6)
            p1 //= 4

            print(p1)
        """, run_in_function=False)

    def test_imod(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __imod__(self, other):
                    self.x %= other
                    self.y %= other
                    return self

            p1 = Pair(5, 6)
            p1 %= 4

            print(p1)
        """, run_in_function=False)

    def test_ipow(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __ipow__(self, other):
                    self.x **= other
                    self.y **= other
                    return self

            p1 = Pair(5, 6)
            p1 **= 4

            print(p1)
        """, run_in_function=False)

    def test_ilshift(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __ilshift__(self, other):
                    self.x <<= other
                    self.y <<= other
                    return self

            p1 = Pair(5, 6)
            p1 <<= 2

            print(p1)
        """, run_in_function=False)

    def test_irshift(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __irshift__(self, other):
                    self.x >>= other
                    self.y >>= other
                    return self

            p1 = Pair(5, 6)
            p1 >>= 2

            print(p1)
        """, run_in_function=False)

    def test_iand(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __iand__(self, other):
                    self.x &= other.x
                    self.y &= other.y
                    return self

            p1 = Pair(5, 6)
            p1 &= Pair(6, 5)

            print(p1)
        """, run_in_function=False)

    def test_ixor(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __ixor__(self, other):
                    self.x ^= other.x
                    self.y ^= other.y
                    return self

            p1 = Pair(5, 6)
            p1 ^= Pair(6, 5)

            print(p1)
        """, run_in_function=False)

    def test_ior(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __ior__(self, other):
                    self.x |= other.x
                    self.y |= other.y
                    return self

            p1 = Pair(5, 6)
            p2 |= Pair(6, 5)

            print(p1)
        """, run_in_function=False)

@expectedFailure
class ClassReverseBinaryOpsDataModelTests(TranspileTestCase):
    def test_radd(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __radd__(self, other):
                    x = self.x + other
                    y = self.y + other
                    return Pair(x, y)

            p1 = Pair(5, 6)

            print(4 + p1)
        """, run_in_function=False)

    def test_rsubtract(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __rsub__(self, other):
                    x = other - self.x
                    y = other - self.y
                    return Pair(x, y)

            p1 = Pair(5, 6)

            print(4 - p1)
        """, run_in_function=False)

    def test_rmultiply(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __rmul__(self, other):
                    x = self.x * other
                    y = self.y * other
                    return Pair(x, y)

            p1 = Pair(5, 6)

            print(3 * p1)
        """, run_in_function=False)

    def test_rtruedivision(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __rtruediv__(self, other):
                    x = other / self.x
                    y = other / self.y
                    return Pair(x, y)

            p1 = Pair(5, 6)

            print(4 / p1)
        """, run_in_function=False)

    def test_rfloordivision(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __rfloordiv__(self, other):
                    x = other // self.x
                    y = other // self.y
                    return Pair(x, y)

            p1 = Pair(5, 6)

            print(4 // p1)
        """, run_in_function=False)

    def test_rmod(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __rmod__(self, other):
                    x = other % self.x
                    y = other % self.y
                    return Pair(x, y)

            p1 = Pair(5, 6)

            print(4 % p1)
        """, run_in_function=False)

    def test_rpow(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __rpow__(self, other):
                    x = other ** self.x
                    y = other ** self.y
                    return Pair(x, y)

            p1 = Pair(5, 6)

            print(4 ** p1)
        """, run_in_function=False)

    def test_rlshift(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __rlshift__(self, other):
                    x =  other << self.x
                    y =  other << self.y
                    return Pair(x, y)

            p1 = Pair(5, 6)

            print(4 << p1)
        """, run_in_function=False)

    def test_rrshift(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __rrshift__(self, other):
                    x =  other >> self.x
                    y =  other >> self.y
                    return Pair(x, y)

            p1 = Pair(5, 6)

            print(4 >> p1)
        """, run_in_function=False)

    def test_rand(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __rand__(self, other):
                    x = other & self.x
                    y = other & self.y
                    return Pair(x, y)

            p1 = Pair(5, 6)

            print(4 & p1)
        """, run_in_function=False)

    def test_rxor(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __rxor__(self, other):
                    x = other ^ self.x
                    y = other ^ self.y
                    return Pair(x, y)

            p1 = Pair(5, 6)

            print(4 ^ p1)
        """, run_in_function=False)

    def test_ror(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __ror__(self, other):
                    x = other | self.x
                    y = other | self.y
                    return Pair(x, y)

            p1 = Pair(5, 6)

            print(4 | p1)
        """, run_in_function=False)


class ClassContainerDataModelTests(TranspileTestCase):
    def test_getitem(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __getitem__(self, idx):
                    if idx == 0 or idx == 'x' or idx == 'X':
                        return self.x
                    if idx == 1 or idx == 'y' or idx == 'Y':
                        return self.y
                    raise IndexError

            p = Pair(5, 6)

            print('p[0] =', p[0])
            print('p[0] =', p[1])
            print('p["x"] =', p['x'])
            print('p["X"] =', p['X'])
            print('p["y"] =', p['y'])
        """, run_in_function=False)

    @expectedFailure
    def test_setitem(self):
        self.assertCodeExecution("""
            class Pair:
                def __init__(self, x, y):
                    self.x = x
                    self.y = y

                def __str__(self):
                    return "({}, {})".format(self.x, self.y)

                def __setitem__(self, key, value):
                    if key == 0 or key == 'x' or key == 'X':
                        self.x = value
                    elif key == 1 or key == 'y' or key == 'Y':
                        self.y = value
                    else:
                        raise IndexError

            p = Pair(5, 6)

            print(p)
            p[1] = 11
            print(p)
            p['x'] = 2
            print(p)
        """, run_in_function=False)
