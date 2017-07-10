import unittest
from . utils import TranspileTestCase


class TestJs2Py(TranspileTestCase):
    def js2py_test(self, decl, check, result):
        self.assertJavaScriptExecution(
            """
            from harness import testfunc

            val = testfunc()
            %s

            print("Done.")
            """ % check,
            js={
                'harness': """
                var harness = function(mod) {

                    mod.testfunc = function() {
                        %s
                        return batavia.types.js2py(obj)
                    };

                    return mod;
                }({});
                """ % decl
            },
            out=result,
        )

    def test_bool(self):
        self.js2py_test(
            decl="""
            var obj = 42;
            """,
            check="""
            print('Val is a %s = %s' % (type(val), val))
            """,
            result="""
            Val is a <class 'int'> = 42
            Done.
            """
        )

    def test_int(self):
        self.js2py_test(
            decl="""
            var obj = 42;
            """,
            check="""
            print('Val is a %s = %s' % (type(val), val))
            """,
            result="""
            Val is a <class 'int'> = 42
            Done.
            """
        )

    def test_float(self):
        self.js2py_test(
            decl="""
            var obj = 42;
            """,
            check="""
            print('Val is a %s = %s' % (type(val), val))
            """,
            result="""
            Val is a <class 'int'> = 42
            Done.
            """
        )

    def test_list(self):
        self.js2py_test(
            decl="""
            var obj = [true, 42, 3.14159, 'value1', [false, 37]];
            """,
            check="""
            print('Val is a %s = %s' % (type(val), val))
            """,
            result="""
            Val is a <class 'list'> = [True, 42, 3.14159, 'value1', [False, 37]]
            Done.
            """
        )

    def test_dict(self):
        self.js2py_test(
            decl="""
                var obj = {
                    'bool_value': true,
                    'integer_value': 42,
                    'float_value': 3.14159,
                    'string_value': 'value1',
                    'list_value': [false, 37]
                };
            """,
            check="""
            print('Val is a %s, with %s items' % (type(val), len(val)))
            print('boolean:', val['bool_value'])
            print('integer:', val['integer_value'])
            print('float:', val['float_value'])
            print('string:', val['string_value'])
            print('list:', val['list_value'])
            """,
            result="""
            Val is a <class 'dict'>, with 5 items
            boolean: True
            integer: 42
            float: 3.14159
            string: value1
            list: [False, 37]
            Done.
            """
        )
