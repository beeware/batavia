from ..utils import ModuleFunctionTestCase, TranspileTestCase

class MathTests(ModuleFunctionTestCase, TranspileTestCase):
    ModuleFunctionTestCase.add_one_arg_tests('math', [
        'acos',
        'acosh',
        'asin',
        'asinh',
        'atan',
        'atanh',
        'ceil',
        'cos',
        'cosh',
        'degrees',
        'exp',
        'expm1',
        'erf',
        'erfc',
        'fabs',
        'factorial',
        'floor',
        'frexp',
        'log',
        'log10',
        'log1p',
        'log2',
        'radians',
        'sin',
        'sinh',
        'sqrt',
        'tan',
        'tanh',
    ])

    ModuleFunctionTestCase.add_two_arg_tests('math', [
        # 'atan2', # commented out because they take too long in CircleCI
        # 'copysign',
        # 'fmod',
        # 'log',
        # 'pow',
    ])

    TODO = [
        'fsum',
        'gamma',
        'gcd',
        'hypot',
        'isclose',
        'isfinite',
        'isinf',
        'isnan',
        'ldexp',
        'lgamma',
        'modf',
        'trunc',
    ]


    not_implemented = [
        'test_math_acos_float',
        'test_math_acos_frozenset',
        'test_math_acos_int',

        'test_math_acosh_float',
        'test_math_acosh_frozenset',

        'test_math_asin_float',
        'test_math_asin_frozenset',
        'test_math_asin_int',

        'test_math_asinh_float',
        'test_math_asinh_frozenset',
        'test_math_asinh_int',

        'test_math_atan2_bool_frozenset',
        'test_math_atan2_bytearray_frozenset',
        'test_math_atan2_bytes_frozenset',
        'test_math_atan2_class_frozenset',
        'test_math_atan2_complex_frozenset',
        'test_math_atan2_dict_frozenset',
        'test_math_atan2_float_frozenset',
        'test_math_atan2_frozenset_bool',
        'test_math_atan2_frozenset_bytearray',
        'test_math_atan2_frozenset_bytes',
        'test_math_atan2_frozenset_class',
        'test_math_atan2_frozenset_complex',
        'test_math_atan2_frozenset_dict',
        'test_math_atan2_frozenset_float',
        'test_math_atan2_frozenset_frozenset',
        'test_math_atan2_frozenset_int',
        'test_math_atan2_frozenset_list',
        'test_math_atan2_frozenset_None',
        'test_math_atan2_frozenset_NotImplemented',
        'test_math_atan2_frozenset_range',
        'test_math_atan2_frozenset_set',
        'test_math_atan2_frozenset_slice',
        'test_math_atan2_frozenset_str',
        'test_math_atan2_frozenset_tuple',
        'test_math_atan2_int_frozenset',
        'test_math_atan2_int_int',
        'test_math_atan2_list_frozenset',
        'test_math_atan2_None_frozenset',
        'test_math_atan2_NotImplemented_frozenset',
        'test_math_atan2_range_frozenset',
        'test_math_atan2_set_frozenset',
        'test_math_atan2_slice_frozenset',
        'test_math_atan2_str_frozenset',
        'test_math_atan2_tuple_frozenset',

        'test_math_atan_frozenset',

        'test_math_atanh_frozenset',

        'test_math_ceil_frozenset',

        'test_math_copysign_bool_frozenset',
        'test_math_copysign_bytearray_frozenset',
        'test_math_copysign_bytes_frozenset',
        'test_math_copysign_class_frozenset',
        'test_math_copysign_complex_frozenset',
        'test_math_copysign_dict_frozenset',
        'test_math_copysign_float_frozenset',
        'test_math_copysign_frozenset_bool',
        'test_math_copysign_frozenset_bytearray',
        'test_math_copysign_frozenset_bytes',
        'test_math_copysign_frozenset_class',
        'test_math_copysign_frozenset_complex',
        'test_math_copysign_frozenset_dict',
        'test_math_copysign_frozenset_float',
        'test_math_copysign_frozenset_frozenset',
        'test_math_copysign_frozenset_int',
        'test_math_copysign_frozenset_list',
        'test_math_copysign_frozenset_None',
        'test_math_copysign_frozenset_NotImplemented',
        'test_math_copysign_frozenset_range',
        'test_math_copysign_frozenset_set',
        'test_math_copysign_frozenset_slice',
        'test_math_copysign_frozenset_str',
        'test_math_copysign_frozenset_tuple',
        'test_math_copysign_int_frozenset',
        'test_math_copysign_list_frozenset',
        'test_math_copysign_None_frozenset',
        'test_math_copysign_NotImplemented_frozenset',
        'test_math_copysign_range_frozenset',
        'test_math_copysign_set_frozenset',
        'test_math_copysign_slice_frozenset',
        'test_math_copysign_str_frozenset',
        'test_math_copysign_tuple_frozenset',

        'test_math_cos_frozenset',

        'test_math_cosh_frozenset',

        'test_math_degrees_frozenset',

        'test_math_erf_frozenset',

        'test_math_erfc_frozenset',

        'test_math_exp_frozenset',

        'test_math_expm1_frozenset',

        'test_math_fabs_frozenset',

        'test_math_factorial_frozenset',

        'test_math_floor_frozenset',

        'test_math_fmod_bool_frozenset',
        'test_math_fmod_bytearray_frozenset',
        'test_math_fmod_bytes_frozenset',
        'test_math_fmod_class_frozenset',
        'test_math_fmod_complex_frozenset',
        'test_math_fmod_dict_frozenset',
        'test_math_fmod_float_frozenset',
        'test_math_fmod_frozenset',
        'test_math_fmod_frozenset_bool',
        'test_math_fmod_frozenset_bytearray',
        'test_math_fmod_frozenset_bytes',
        'test_math_fmod_frozenset_class',
        'test_math_fmod_frozenset_complex',
        'test_math_fmod_frozenset_dict',
        'test_math_fmod_frozenset_float',
        'test_math_fmod_frozenset_frozenset',
        'test_math_fmod_frozenset_int',
        'test_math_fmod_frozenset_list',
        'test_math_fmod_frozenset_None',
        'test_math_fmod_frozenset_NotImplemented',
        'test_math_fmod_frozenset_range',
        'test_math_fmod_frozenset_set',
        'test_math_fmod_frozenset_slice',
        'test_math_fmod_frozenset_str',
        'test_math_fmod_frozenset_tuple',
        'test_math_fmod_int_frozenset',
        'test_math_fmod_list_frozenset',
        'test_math_fmod_None_frozenset',
        'test_math_fmod_NotImplemented_frozenset',
        'test_math_fmod_range_frozenset',
        'test_math_fmod_set_frozenset',
        'test_math_fmod_slice_frozenset',
        'test_math_fmod_str_frozenset',
        'test_math_fmod_tuple_frozenset',

        'test_math_frexp_frozenset',

        'test_math_log_bool_frozenset',
        'test_math_log_bytearray_frozenset',
        'test_math_log_bytes_frozenset',
        'test_math_log_class_frozenset',
        'test_math_log_complex_frozenset',
        'test_math_log_dict_frozenset',
        'test_math_log_float_frozenset',
        'test_math_log_frozenset',
        'test_math_log_frozenset_bool',
        'test_math_log_frozenset_bytearray',
        'test_math_log_frozenset_bytes',
        'test_math_log_frozenset_class',
        'test_math_log_frozenset_complex',
        'test_math_log_frozenset_dict',
        'test_math_log_frozenset_float',
        'test_math_log_frozenset_frozenset',
        'test_math_log_frozenset_int',
        'test_math_log_frozenset_list',
        'test_math_log_frozenset_None',
        'test_math_log_frozenset_NotImplemented',
        'test_math_log_frozenset_range',
        'test_math_log_frozenset_set',
        'test_math_log_frozenset_slice',
        'test_math_log_frozenset_str',
        'test_math_log_frozenset_tuple',
        'test_math_log_int_frozenset',
        'test_math_log_list_frozenset',
        'test_math_log_None_frozenset',
        'test_math_log_NotImplemented_frozenset',
        'test_math_log_range_frozenset',
        'test_math_log_set_frozenset',
        'test_math_log_slice_frozenset',
        'test_math_log_str_frozenset',
        'test_math_log_tuple_frozenset',

        'test_math_log10_frozenset',

        'test_math_log1p_frozenset',

        'test_math_log2_frozenset',

        'test_math_pow_bool_frozenset',
        'test_math_pow_bytearray_frozenset',
        'test_math_pow_bytes_frozenset',
        'test_math_pow_class_frozenset',
        'test_math_pow_complex_frozenset',
        'test_math_pow_dict_frozenset',
        'test_math_pow_float_frozenset',
        'test_math_pow_frozenset_bool',
        'test_math_pow_frozenset_bytearray',
        'test_math_pow_frozenset_bytes',
        'test_math_pow_frozenset_class',
        'test_math_pow_frozenset_complex',
        'test_math_pow_frozenset_dict',
        'test_math_pow_frozenset_float',
        'test_math_pow_frozenset_frozenset',
        'test_math_pow_frozenset_int',
        'test_math_pow_frozenset_list',
        'test_math_pow_frozenset_None',
        'test_math_pow_frozenset_NotImplemented',
        'test_math_pow_frozenset_range',
        'test_math_pow_frozenset_set',
        'test_math_pow_frozenset_slice',
        'test_math_pow_frozenset_str',
        'test_math_pow_frozenset_tuple',
        'test_math_pow_int_frozenset',
        'test_math_pow_list_frozenset',
        'test_math_pow_None_frozenset',
        'test_math_pow_NotImplemented_frozenset',
        'test_math_pow_range_frozenset',
        'test_math_pow_set_frozenset',
        'test_math_pow_slice_frozenset',
        'test_math_pow_str_frozenset',
        'test_math_pow_tuple_frozenset',

        'test_math_radians_frozenset',

        'test_math_sin_frozenset',

        'test_math_sinh_frozenset',

        'test_math_sqrt_frozenset',

        'test_math_tan_frozenset',

        'test_math_tanh_frozenset',
    ]

    def test_constants(self):
        self.assertCodeExecution("""
            import math
            print(math.e)
            print(math.inf)
            print(math.nan)
            print(math.pi)
            """)

    def test_erf(self):
        # test some of the edge cases of erf to 15 digits of precision
        self.assertCodeExecution("""
            import math
            print(round(math.erf(0.75) * (10**15)))
            print(round(math.erf(1.40) * (10**15)))
            print(round(math.erf(1.60) * (10**15)))
            """)

    def test_frexp(self):
        # test some of the edge cases of for frexp
        self.assertCodeExecution("""
            import math
            print(math.frexp(float('nan')))
            print(math.frexp(float('inf')))
            print(math.frexp(float('-inf')))
            print(math.frexp(-0.0))
            print(math.frexp(0.0))
            print(math.frexp(2**-1026)) # denormal
            print(math.frexp(2**-1027)) # denormal
            print(math.frexp(1.9**-1150)) # denormal
            """)

    def test_docstrings(self):
        self.assertCodeExecution("""
        import math
        print(math.acos.__doc__)
        print(math.acosh.__doc__)
        print(math.asin.__doc__)
        print(math.asinh.__doc__)
        print(math.atan.__doc__)
        print(math.atan2.__doc__)
        print(math.atanh.__doc__)
        print(math.ceil.__doc__)
        print(math.copysign.__doc__)
        print(math.cos.__doc__)
        print(math.cosh.__doc__)
        print(math.degrees.__doc__)
        print(math.erf.__doc__)
        print(math.erfc.__doc__)
        print(math.exp.__doc__)
        print(math.expm1.__doc__)
        print(math.fabs.__doc__)
        print(math.factorial.__doc__)
        print(math.floor.__doc__)
        print(math.fmod.__doc__)
        print(math.frexp.__doc__)
        print(math.fsum.__doc__)
        print(math.gamma.__doc__)
        print(math.gcd.__doc__)
        print(math.hypot.__doc__)
        print(math.isclose.__doc__)
        print(math.isfinite.__doc__)
        print(math.isinf.__doc__)
        print(math.isnan.__doc__)
        print(math.ldexp.__doc__)
        print(math.lgamma.__doc__)
        print(math.log.__doc__)
        print(math.log10.__doc__)
        print(math.log1p.__doc__)
        print(math.log2.__doc__)
        print(math.modf.__doc__)
        print(math.pow.__doc__)
        print(math.radians.__doc__)
        print(math.sin.__doc__)
        print(math.sinh.__doc__)
        print(math.sqrt.__doc__)
        print(math.tan.__doc__)
        print(math.tanh.__doc__)
        print(math.trunc.__doc__)
        """)

    def test_big_log(self):
        self.assertCodeExecution("""
            import math
            print(math.log(3**4000, 2**8100))
            """)

    def test_big_log2(self):
        self.assertCodeExecution("""
            import math
            print(math.log2(709874778209505449164547067054458951083931193926642747495017164186645751655744875421269098582104920390605124237633349342717862507319743615626304875347198674644024921355443346065756812077971384925385976688379587725754770781522846570196349704093046107733180534854434524219964358869238720766190004394476819714001258060050613741584644204075051799051905412773797764952606797949151269802416842454484878798473655073876851371491648288958091028337719596855793230188189772070425820554754458556422280418578218555923937387100230666995832561534819765559294519688376125270429521528901767210741847034724205354522740365483017692249820977706071766039350554571519522193325468892496901898817050295077767956445820266181178428873389385457683384690338027773216128156778372102965337341550587618703692943484656997212771985652065880479903542484558677381542438761681533659023452046408703963028815731967051176232784200533079872517065868927439508179887199747307382027271992367973398752203981370932249653618260869652706332493188390438513150963811297163798071038159044928635041637968052076196357089673578011991707879168341931769577280340919325350586520247371170996197238085208451603359009350099978722663674682758701714150597529361822020896347673618446802372853705086762735076753958743009317050891017544375235501024966086837113895250374683405794439114588602689057542397605899402997007278070746928906217565081884406372071588251849468961039107688076621346443316677903414760713997208752939061354773484040316969671376565833163179447504252238355930440353052925533204737199987806741014066788960204161921421661842362108279851816761342464770187337809510195703092924098813875328889150143200978204553812664656609886055094625058698584339535625840297952984122026248025706583198398576642795466682257872986978621024920781727232257799954982443614621424967054998813367293022309278882814078744897409296550039950294130952382751224274116423061468974653243010683217587256595866362285666690540129606522748087781211700305323617809257258869461082545385948387418641936602911595988585341866304680338433228594272988376062066145489663624587207289726229598577225356620186185104940607264294055665578166855271669760127452193136730694091219875987070929716353044606178328132861866481581176064425671499601899418528529810234656671652825363206294954548973847080477558394872610479878723418423615445410371409596278175917142530165486625362513678722139651643157453275449743997375003463533610556290097654020572842895402524185827121030107))
            """)
