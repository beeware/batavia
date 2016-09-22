from ..utils import TranspileTestCase

import unittest

# do basic tests for now
# TODO: execute complete tests for each stdlib module

class StdlibTests(TranspileTestCase):
    def test_colorsys(self):
        self.assertCodeExecution("""
            import colorsys
            print(sorted([x for x in list(dir(colorsys)) if not x.startswith('_')]))
            """, run_in_function=False)

    def test_copyreg(self):
        self.assertCodeExecution("""
            import copyreg
            print(sorted([x for x in list(dir(copyreg)) if not x.startswith('_')]))
            """, run_in_function=False)

    def test_this(self):
        self.assertCodeExecution("""
            import this
            print(sorted([x for x in list(dir(this)) if not x.startswith('_')]))
            """,
            substitutions={
                # workaround for PhantomJS producing extra new lines which we have to squash
                "Peters\n\nBeautiful": ["Peters\nBeautiful",]
            }, run_in_function=False)
