from ..utils import TranspileTestCase

import unittest

# do basic tests for now
# TODO: execute complete tests for each stdlib module

def test_module(self, name, exclude=[]):
    self.assertCodeExecution("""
        import %s
        print(sorted([x for x in list(dir(%s)) if not x.startswith('_') and x not in set(%s)]))
        """ % (name, name, repr(exclude)), run_in_function=False)

class StdlibTests(TranspileTestCase):
    def test__weakref(self):
        test_module(self, "_weakref")

    def test__weakrefset(self):
        test_module(self, "_weakrefset")

    def test_abc(self):
        test_module(self, "abc", exclude=['ref'])

    def test_bisect(self):
        test_module(self, "bisect")

    def test_colorsys(self):
        test_module(self, "colorsys")

    def test_copyreg(self):
        test_module(self, "copyreg")

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

    def test_this(self):
        self.assertCodeExecution("""
            import this
            print(sorted([x for x in list(dir(this)) if not x.startswith('_')]))
            """,
            substitutions={
                # workaround for PhantomJS producing extra new lines which we have to squash
                "Peters\n\nBeautiful": ["Peters\nBeautiful",]
            }, run_in_function=False)
