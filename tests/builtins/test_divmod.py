from .. utils import TranspileTestCase, BuiltinFunctionTestCase, BuiltinTwoargFunctionTestCase


class DivmodTests(TranspileTestCase):
    pass


class BuiltinDivmodFunctionTests(BuiltinFunctionTestCase, TranspileTestCase):
    function = "divmod"


class BuiltinTwoargDivmodFunctionTests(BuiltinTwoargFunctionTestCase, TranspileTestCase):
    function = "divmod"

    not_implemented = [
        'test_bool_bool',
        'test_bool_float',
        'test_bool_int',

        'test_float_bool',
        'test_float_float',
        'test_float_int',

        'test_int_bool',
        'test_int_float',
        'test_int_int',
    ]
