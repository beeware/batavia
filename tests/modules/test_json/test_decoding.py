from ...utils import TranspileTestCase, ModuleFunctionTestCase, adjust
from .JSON_data import pass_data, fail_data


# TODO(abonie): refactor to facilitate code reuse
class LoadsTests(ModuleFunctionTestCase, TranspileTestCase):

    not_implemented_versions = {
        'test_fail': ['3.5', '3.6']
    }

    def test_pass(self):
        for data in pass_data:
            self.assertCodeExecution(
                adjust("""
                    import json
                    print(type(json.loads(r'''{}''')))
                """).format(data),
                run_in_function=False,
            )

    def test_fail(self):
        for data in fail_data:
            self.assertCodeExecution(
                adjust("""
                    import json
                    try:
                       json.loads(r'''{}''')
                    except Exception as e:
                       print(type(e))
                """).format(data),
                run_in_function=False,
            )

    def test_empty(self):
        self.assertCodeExecution("""
            import json
            o = json.loads('{}')
            print(o, type(o))
            o = json.loads('[]')
            print(o, type(o))
        """)

    def test_int(self):
        self.assertCodeExecution("""
            import json
            o = json.loads('42')
            print(o, type(o))
        """)

    def test_float(self):
        self.assertCodeExecution("""
            import json
            o = json.loads('3.14')
            print(o, type(o))
        """)

    def test_str(self):
        self.assertCodeExecution("""
            import json
            o = json.loads('"Mÿ hôvèrçràft îß fûłl öf éêlś"')
            print(o, type(o))
        """)

    def test_list(self):
        self.assertCodeExecution("""
            import json
            o = json.loads('[1, 2, "3", {}]')
            print(o, type(o))
        """)

    def test_object(self):
        subst = {
            "{'2': 'b', 'c': [4, 5], 'a': 1}": [
                "{'2': 'b', 'a': 1, 'c': [4, 5]}",
                "{'a': 1, 'c': [4, 5], '2': 'b'}",
                "{'a': 1, '2': 'b', 'c': [4, 5]}",
                "{'c': [4, 5], 'a': 1, '2': 'b'}",
                "{'c': [4, 5], '2': 'b', 'a': 1}",
            ]
        }
        self.assertCodeExecution("""
            import json
            o = json.loads('{"a": 1, "2": "b", "c": [4, 5]}')
            print(o, type(o))
        """, substitutions=subst)

    def test_cls(self):
        self.assertCodeExecution("""
            import json

            class d:
                def decode(self, s):
                    return s[::-1]

            print(json.loads('redoced driew eno si siht', cls=d))
        """)

    def test_object_hook(self):
        subst = {"{'b': 3, 'c': 42}": ["{'c': 42, 'b': 3}"]}
        self.assertCodeExecution("""
            import json

            def hook(d):
                if 'a' in d:
                    return 42
                return d


            print(json.loads(
                '[{"a": 1}, 2, {"b": 3, "c": {"a": 4, "b": 5}}]',
                object_hook=hook)
            )
        """, substitutions=subst)


class LoadTests(ModuleFunctionTestCase, TranspileTestCase):

    not_implemented_versions = {
        'test_fail': ['3.5', '3.6']
    }

    fp_def = """class fp:
    def __init__(self, doc):
        self.doc = doc
    def read(self):
        return self.doc"""

    def test_pass(self):
        for data in pass_data:
            self.assertCodeExecution(
                adjust("""
                    import json
                    {}
                    json.load(fp(r'''{}'''))
                """).format(self.fp_def, data),
                run_in_function=False,
            )

    def test_fail(self):
        for data in fail_data:
            self.assertCodeExecution(
                adjust("""
                    import json
                    {}
                    try:
                       json.load(fp(r'''{}'''))
                    except Exception as e:
                       print(type(e))
                """).format(self.fp_def, data),
                run_in_function=False,
            )

    def test_empty(self):
        self.assertCodeExecution(
            adjust("""
                import json
                {}
                o = json.load(fp('{{}}'))
                print(o, type(o))
                o = json.load(fp('[]'))
                print(o, type(o))
            """).format(self.fp_def),
            run_in_function=False,
        )

    def test_int(self):
        self.assertCodeExecution(
            adjust("""
                import json
                {}
                o = json.load(fp('42'))
                print(o, type(o))
            """).format(self.fp_def),
            run_in_function=False,
        )

    def test_float(self):
        self.assertCodeExecution(
            adjust("""
                import json
                {}
                o = json.load(fp('3.14'))
                print(o, type(o))
            """).format(self.fp_def),
            run_in_function=False,
        )

    def test_str(self):
        self.assertCodeExecution(
            adjust("""
                import json
                {}
                o = json.load(fp('"Mÿ hôvèrçràft îß fûłl öf éêlś"'))
                print(o, type(o))
            """).format(self.fp_def),
            run_in_function=False,
        )

    def test_list(self):
        self.assertCodeExecution(
            adjust("""
                import json
                {}
                o = json.load(fp('[1, 2, "3", {{}}]'))
                print(o, type(o))
            """).format(self.fp_def),
            run_in_function=False,
        )

    def test_object(self):
        subst = {
            "{'2': 'b', 'c': [4, 5], 'a': 1}": [
                "{'2': 'b', 'a': 1, 'c': [4, 5]}",
                "{'a': 1, 'c': [4, 5], '2': 'b'}",
                "{'a': 1, '2': 'b', 'c': [4, 5]}",
                "{'c': [4, 5], 'a': 1, '2': 'b'}",
                "{'c': [4, 5], '2': 'b', 'a': 1}",
            ]
        }
        self.assertCodeExecution(
            adjust("""
                import json
                {}
                o = json.load(fp('{{"a": 1, "2": "b", "c": [4, 5]}}'))
                print(o, type(o))
            """).format(self.fp_def),
            substitutions=subst,
            run_in_function=False,
        )

    def test_cls(self):
        self.assertCodeExecution(
            adjust("""
                import json

                {}

                class d:
                    def decode(self, s):
                        return s[::-1]

                print(json.load(fp('redoced driew eno si siht'), cls=d))
            """).format(self.fp_def),
            run_in_function=False,
        )

    def test_object_hook(self):
        subst = {"{'b': 3, 'c': 42}": ["{'c': 42, 'b': 3}"]}
        self.assertCodeExecution(
            adjust("""
                import json

                {}

                def hook(d):
                    if 'a' in d:
                        return 42
                    return d

                print(json.load(
                    fp('[{{"a": 1}}, 2, {{"b": 3, "c": {{"a": 4, "b": 5}}}}]'),
                    object_hook=hook)
                )
            """).format(self.fp_def),
            substitutions=subst,
            run_in_function=False,
        )


class JSONDecoderTests(ModuleFunctionTestCase, TranspileTestCase):

    not_implemented_versions = {
        'test_fail': ['3.5', '3.6']
    }

    def test_pass(self):
        for data in pass_data:
            self.assertCodeExecution(
                adjust("""
                    import json
                    json.JSONDecoder().decode(r'''{}''')
                """).format(data),
                run_in_function=False,
            )

    def test_fail(self):
        for data in fail_data:
            self.assertCodeExecution(
                adjust("""
                    import json
                    try:
                       json.JSONDecoder().decode(r'''{}''')
                    except Exception as e:
                       print(type(e))
                """).format(data),
                run_in_function=False,
            )

    def test_empty(self):
        self.assertCodeExecution("""
            import json
            dec = json.JSONDecoder()
            o = dec.decode('{}')
            print(o, type(o))
            o = dec.decode('[]')
            print(o, type(o))
        """)

    def test_int(self):
        self.assertCodeExecution("""
            import json
            o = json.JSONDecoder().decode('42')
            print(o, type(o))
        """)

    def test_float(self):
        self.assertCodeExecution("""
            import json
            o = json.JSONDecoder().decode('3.14')
            print(o, type(o))
        """)

    def test_str(self):
        self.assertCodeExecution("""
            import json
            o = json.JSONDecoder().decode('"Mÿ hôvèrçràft îß fûłl öf éêlś"')
            print(o, type(o))
        """)

    def test_list(self):
        self.assertCodeExecution("""
            import json
            o = json.JSONDecoder().decode('[1, 2, "3", {}]')
            print(o, type(o))
        """)

    def test_object(self):
        subst = {
            "{'2': 'b', 'c': [4, 5], 'a': 1}": [
                "{'2': 'b', 'a': 1, 'c': [4, 5]}",
                "{'a': 1, 'c': [4, 5], '2': 'b'}",
                "{'a': 1, '2': 'b', 'c': [4, 5]}",
                "{'c': [4, 5], 'a': 1, '2': 'b'}",
                "{'c': [4, 5], '2': 'b', 'a': 1}",
            ]
        }
        self.assertCodeExecution("""
            import json
            o = json.JSONDecoder().decode('{"a": 1, "2": "b", "c": [4, 5]}')
            print(o, type(o))
        """, substitutions=subst)
