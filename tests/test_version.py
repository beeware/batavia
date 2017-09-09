from .utils import TranspileTestCase, adjust


class TestVersionID(TranspileTestCase):
    def version_test(self, params, result):
        self.assertJavaScriptExecution(
            """
            from harness import testfunc

            print(testfunc())
            """,
            js={
                'harness': adjust("""
                var harness = {{
                    testfunc: function() {{
                        var x = batavia.core.version.version_id('{0}')
                        var y = batavia.core.version.version_id('{1}')
                        return new batavia.types.Bool(x {2} y)
                    }}
                }};
                """.format(*params)),
            },
            out=result,
        )

    def earlier_test(self, params, result):
        params.append('<')
        self.version_test(params, result)

    def later_test(self, params, result):
        params.append('>')
        self.version_test(params, result)

    def test_earlier(self):
        self.earlier_test(params=['3.6', '3.5'], result='False\n')
        self.earlier_test(params=['3.6', '3.6'], result='False\n')
        self.earlier_test(params=['3.5', '3.6'], result='True\n')

    def test_later(self):
        self.later_test(params=['3.6', '3.5'], result='True\n')
        self.later_test(params=['3.6', '3.6'], result='False\n')
        self.later_test(params=['3.5', '3.6'], result='False\n')

    def test_prerelease(self):
        self.later_test(params=['3.5', '3.5a0'], result='True\n')
        self.later_test(params=['3.5a0', '3.5'], result='False\n')
        self.earlier_test(params=['3.5', '3.5a0'], result='False\n')
        self.earlier_test(params=['3.5a0', '3.5'], result='True\n')
        self.later_test(params=['3.5a0', '3.5b0'], result='False\n')
        self.later_test(params=['3.5a1', '3.5a0'], result='True\n')
