from ..utils import TranspileTestCase, expected_failing_versions

# do basic tests for now
# TODO: execute complete tests for each stdlib module


def _test_module(self, name, exclude=[]):
    self.assertCodeExecution("""
        import %s
        print(sorted([x for x in list(dir(%s)) if not x.startswith('_') and x not in set(%s)]))
        """ % (name, name, repr(exclude)), run_in_function=False)


class StdlibTests(TranspileTestCase):
    def test__weakref(self):
        _test_module(self, "_weakref")

    @expected_failing_versions(['3.4', '3.5'])
    def test__weakrefset(self):
        _test_module(self, "_weakrefset")

    @expected_failing_versions(['3.4', '3.5'])
    def test_abc(self):
        _test_module(self, "abc", exclude=['ref'])

    @expected_failing_versions(['3.4', '3.5'])
    def test_bisect(self):
        _test_module(self, "bisect")

    @expected_failing_versions(['3.4', '3.5'])
    def test_colorsys(self):
        _test_module(self, "colorsys")

    @expected_failing_versions(['3.4', '3.5'])
    def test_copyreg(self):
        _test_module(self, "copyreg")

    def test_token(self):
        # our version doesn't quite sync up
        self.assertCodeExecution("""
            import token
            print("Done")
            """)

    def test_operator(self):
        # there is a bunch of extra stuff in this in the native Python 3.5 module
        self.assertCodeExecution("""
            import operator
            print("Done")
            """)

    def test_stat(self):
        # there is a bunch of extra stuff in this in the native Python 3.5 module
        self.assertCodeExecution("""
            import stat
            print("Done")
            """)

    @expected_failing_versions(['3.4', '3.5'])
    def test_this(self):
        self.assertCodeExecution("""
            import this
            print(sorted([x for x in list(dir(this)) if not x.startswith('_')]))
            """,
            substitutions={
                # workaround for PhantomJS producing extra new lines which we have to squash
                "Peters\n\nBeautiful": ["Peters\nBeautiful",]
            }, run_in_function=False)
