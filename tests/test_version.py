from .utils import TranspileTestCase


class TestVersionID(TranspileTestCase):
    def version_test(self, params, result):
        self.assertJavaScriptExecution(
            """
            from harness import testfunc

            print(testfunc())
            """,
            js={
                'harness': """
                var harness = {{
                    testfunc: function() {{
                        var x = new batavia.core.version.VersionID({this})
                        var y = new batavia.core.version.VersionID({that})
                        return new batavia.types.Bool(x.{method}(y))
                    }}
                }};
                """.format(**params),
            },
            out=result,
        )

    def earlier_test(self, params, result):
        params['method'] = 'earlier'
        self.version_test(params, result)

    def later_test(self, params, result):
        params['method'] = 'later'
        self.version_test(params, result)

    def test_earlier(self):
        self.earlier_test(params={'this': '3.6', 'that': '3.5'}, result='False\n')
        self.earlier_test(params={'this': '3.6', 'that': '3.6'}, result='False\n')
        self.earlier_test(params={'this': '3.5', 'that': '3.6'}, result='True\n')

    def test_later(self):
        self.later_test(params={'this': '3.6', 'that': '3.5'}, result='True\n')
        self.later_test(params={'this': '3.6', 'that': '3.6'}, result='False\n')
        self.later_test(params={'this': '3.5', 'that': '3.6'}, result='False\n')
