from ..utils import TranspileTestCase

import random
import unittest


test_nums = []
random.seed(1234)
for i in range(100):
    test_nums.append(random.random() * 5.0 - 10.0)

class MathTests(TranspileTestCase):

    def test_constants(self):
        self.assertCodeExecution("""
            import math
            print(math.e)
            print(math.inf)
            print(math.nan)
            print(math.pi)
            """)

    def one_arg_func(self, funcname, positive=False):
        if positive:
            nums = [abs(num) for num in test_nums]
        else:
            nums = test_nums
        self.assertCodeExecution("""
            import math
            nums = %s
            for r in nums:
                print(math.%s(r))
            """ % (repr(nums), funcname))

    def two_arg_func(self, funcname, positive=False):
        if positive:
            nums = [abs(num) for num in test_nums]
        else:
            nums = test_nums
        self.assertCodeExecution("""
            import math
            nums = %s
            for r in nums:
                for s in nums:
                    print(math.%s(r, s))
            """ % (repr(nums), funcname))


    @unittest.expectedFailure
    def test_acos(self):
        self.one_arg_func('acos')

    @unittest.expectedFailure
    def test_acosh(self):
        self.one_arg_func('acosh')

    @unittest.expectedFailure
    def test_asin(self):
        self.one_arg_func('asin')

    @unittest.expectedFailure
    def test_asinh(self):
        self.one_arg_func('asinh')

    def test_atan(self):
        self.one_arg_func('atan')

    def test_atan2(self):
        self.two_arg_func('atan2')

    @unittest.expectedFailure
    def test_atanh(self):
        self.one_arg_func('atanh')

    def test_ceil(self):
        self.one_arg_func('ceil')

    @unittest.expectedFailure
    def test_copysign(self):
        self.one_arg_func('copysign')

    def test_cos(self):
        self.one_arg_func('cos')

    @unittest.expectedFailure
    def test_cosh(self):
        self.one_arg_func('cosh')

    @unittest.expectedFailure
    def test_degrees(self):
        self.one_arg_func('degrees')

    @unittest.expectedFailure
    def test_erf(self):
        self.one_arg_func('erf')

    @unittest.expectedFailure
    def test_erfc(self):
        self.one_arg_func('erfc')

    @unittest.expectedFailure # TODO: this is correct, but differences in float printing makes it fail
    def test_exp(self):
        self.one_arg_func('exp')

    @unittest.expectedFailure
    def test_expm1(self):
        self.one_arg_func('expm1')

    @unittest.expectedFailure
    def test_fabs(self):
        self.one_arg_func('fabs')

    @unittest.expectedFailure
    def test_factorial(self):
        self.one_arg_func('factorial')

    def test_floor(self):
        self.one_arg_func('floor')

    @unittest.expectedFailure
    def test_fmod(self):
        self.one_arg_func('fmod')

    @unittest.expectedFailure
    def test_frexp(self):
        self.one_arg_func('frexp')

    @unittest.expectedFailure
    def test_fsum(self):
        self.one_arg_func('fsum')

    @unittest.expectedFailure
    def test_gamma(self):
        self.one_arg_func('gamma')

    @unittest.expectedFailure
    def test_gcd(self):
        self.one_arg_func('gcd')

    @unittest.expectedFailure
    def test_hypot(self):
        self.two_arg_func('hypot')

    @unittest.expectedFailure
    def test_isclose(self):
        self.one_arg_func('isclose')

    @unittest.expectedFailure
    def test_isfinite(self):
        self.one_arg_func('isfinite')

    @unittest.expectedFailure
    def test_isinf(self):
        self.one_arg_func('isinf')

    @unittest.expectedFailure
    def test_isnan(self):
        self.one_arg_func('isnan')

    @unittest.expectedFailure
    def test_ldexp(self):
        self.one_arg_func('ldexp')

    @unittest.expectedFailure
    def test_lgamma(self):
        self.one_arg_func('lgamma')

    def test_log(self):
        self.one_arg_func('log', positive=True)
        self.two_arg_func('log', positive=True)

    @unittest.expectedFailure
    def test_log10(self):
        self.one_arg_func('log10', positive=True)

    @unittest.expectedFailure
    def test_log1p(self):
        self.one_arg_func('log1p', positive=True)

    @unittest.expectedFailure
    def test_log2(self):
        self.one_arg_func('log2', positive=True)

    @unittest.expectedFailure
    def test_modf(self):
        self.one_arg_func('modf')

    def test_pow(self):
        self.two_arg_func('pow', positive=True)

    @unittest.expectedFailure
    def test_radians(self):
        self.one_arg_func('radians')

    def test_sin(self):
        self.one_arg_func('sin')

    @unittest.expectedFailure
    def test_sinh(self):
        self.one_arg_func('sinh')

    def test_sqrt(self):
        self.one_arg_func('sqrt', positive=True)

    def test_tan(self):
        self.one_arg_func('tan')

    @unittest.expectedFailure
    def test_tanh(self):
        self.one_arg_func('tanh')

    @unittest.expectedFailure
    def test_trunc(self):
        self.one_arg_func('trunc')
