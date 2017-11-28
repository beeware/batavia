from itertools import product
from ...utils import TranspileTestCase, ModuleFunctionTestCase, \
    MethodTestCase, adjust


class JSONEncoderTests(MethodTestCase, TranspileTestCase):

    def test_encode_type(self):
        self.assertCodeExecution("""
            import json
            enc = json.JSONEncoder()
            print(type(enc.encode("str")))
            print(type(enc.encode({})))
            print(type(enc.encode([])))
            print(type(enc.encode(1)))
            print(type(enc.encode(1.5)))
            print(type(enc.encode((4, 2))))
            print(type(enc.encode(None)))
            print(type(enc.encode(True)))
        """)

    def test_circular(self):
        self.assertCodeExecution("""
            import json

            enc = json.JSONEncoder()
            d = {1: {2: {}}, 4: 5}
            d[1][2][3] = d
            try:
                enc.encode(d)
            except ValueError as e:
                print(e)

            l = []
            l.append(l)
            try:
                enc.encode(l)
            except ValueError as e:
                print(e)

            def f(x):
                return x

            enc = json.JSONEncoder(default=f)
            try:
                enc.encode(object())
            except ValueError as e:
                print(e)
        """)


    is_flakey = [
        'test_json_JSONEncoder_encode_dict',   # fails due to dict ordering
    ]


JSONEncoderTests.add_one_arg_method_tests('json', 'JSONEncoder', ['encode'])


class DumpsTests(ModuleFunctionTestCase, TranspileTestCase):


    is_flakey = [
        'test_json_dumps_dict',   # fails due to dict ordering
    ]

DumpsTests.add_one_arg_tests('json', ['dumps'])


class DumpTests(TranspileTestCase):
    pass


TEMPLATES = [
    (
        JSONEncoderTests,
        """
        import json
        enc = json.JSONEncoder({kwargs})
        data = {data}
        try:
            print(enc.encode(data))
        except Exception as e:
            print(type(e), ':', e)
        """,
        'JSONEncoder_encode',
    ),
    (
        DumpsTests,
        """
        import json
        data = {data}
        try:
            print(json.dumps(data, {kwargs}))
        except Exception as e:
            print(type(e), ':', e)
        """,
        'dumps',
    ),
    (
        DumpTests,
        """
        import json
        class writeable:
            def __init__(self):
                self.x = []
            def write(self, x):
                self.x.append(x)
        data = {data}
        fp = writeable()
        try:
            json.dump(data, fp, {kwargs})
            print(''.join(fp.x))
        except Exception as e:
            print(type(e))
        """,
        'dump',
    ),

]

TEST_CASES = [
    (
        'illegal_dict_key',
        ["{object(): 1, 'k': 'v'}"],
        ['', 'skipkeys=True'],
    ),
    (
        'ensure_ascii',
        ["'Mÿ hôvèrçràft îß fûłl öf éêlś'"],
        ['ensure_ascii=False'],
    ),
    (
        'out_of_range_float',
        ["[float('nan'), float('inf'), float('-inf')]"],
        [''],
    ),
    (
        'allow_nan',
        ["[1, 2, float('nan')]", "[1, 2, float('inf')]"],
        ['allow_nan=False'],
    ),
    (
        'separators',
        ["[1, {2: 3}]"],
        ["separators=('#', '$')"],
    ),
    (
        'indent',
        ["[1, 2, [3, [4, 5]], 6]", "{1: [2, 3, {4: {5: 6}}]}"],
        ['indent=2', "indent='$'"],
    ),
    (
        'indent_separators',
        ["[1, 2, {'a': 3}]", "{1: [2, 3, {4: {5: 6}}]}"],
        ["indent=3, separators=(' , ', '->')"],
    ),
    (
        'sort_keys',
        ['{9: 8, 2: 1, 7: {6: 5, 4: 3}}'],
        ['sort_keys=True'],
    ),
    (
        'default',
        ['{1: object()}'],
        ['default=lambda x: {}'],
    ),
]


def create_test_func(code):
    def func(self):
        self.assertCodeExecution(code, run_in_function=False)
    return func


def add_test_cases(templates, test_cases):
    for cls, template, name_template in templates:
        for name, data_list, kwargs_list in test_cases:
            for i, (data, kwargs) in enumerate(product(data_list, kwargs_list)):
                test_name = 'test_{}_{}_{}'.format(name_template, name, i)
                code = adjust(template.format(kwargs=kwargs, data=data))
                setattr(cls, test_name, create_test_func(code))

add_test_cases(TEMPLATES, TEST_CASES)
