from .utils import TranspileTestCase, adjust


class TestVersionID(TranspileTestCase):
    def version_test(self, v1, v2, op, result):
        self.assertJavaScriptExecution(
            """
            from harness import testfunc

            print(testfunc())
            """,
            js={
                'harness': adjust("""
                let harness = {{
                    testfunc: function() {{
                        let x = batavia.version.version_id('{0}')
                        let y = batavia.version.version_id('{1}')
                        return batavia.types.pybool(x {2} y)
                    }}
                }};
                """.format(v1, v2, op)),
            },
            out=result,
        )

    def assert_earlier(self, v1, v2):
        self.version_test(v1, v2, '<', 'True\n')

    def assert_not_earlier(self, v1, v2):
        self.version_test(v1, v2, '<', 'False\n')

    def assert_later(self, v1, v2):
        self.version_test(v1, v2, '>', 'True\n')

    def assert_not_later(self, v1, v2):
        self.version_test(v1, v2, '>', 'False\n')

    def test_earlier(self):
        self.assert_not_earlier('3.6', '3.5')
        self.assert_not_earlier('3.6', '3.6')
        self.assert_earlier('3.5', '3.6')

    def test_later(self):
        self.assert_later('3.6', '3.5')
        self.assert_not_later('3.6', '3.6')
        self.assert_not_later('3.5', '3.6')

    def test_prerelease(self):
        self.assert_later('3.5', '3.5a0')
        self.assert_not_later('3.5a0', '3.5')
        self.assert_not_earlier('3.5', '3.5a0')
        self.assert_earlier('3.5a0', '3.5')
        self.assert_not_later('3.5a0', '3.5b0')
        self.assert_later('3.5a1', '3.5a0')
