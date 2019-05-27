import sys
from unittest import expectedFailure


def expected_failing_versions(versions):
    py_version = "%s.%s" % (sys.version_info.major, sys.version_info.minor)
    if py_version in versions:
        return expectedFailure
    return lambda f: f


class NotImplementedToExpectedFailure:

    def _is_flakey(self):
        return self._testMethodName in getattr(self, "is_flakey", [])

    def _is_not_implemented(self):
        '''
        A test is expected to fail if:
          (a) Its name can be found in the test case's 'not_implemented' list
          (b) Its name can be found in the test case's 'is_flakey' list
          (c) Its name can be found in the test case's
              'not_implemented_versions' dictionary _and_ the current
              python version is in the dict entry's list
        :return: True if test is expected to fail
        '''
        method_name = self._testMethodName
        if method_name in getattr(self, 'not_implemented', []):
            return True

        if self._is_flakey():
            # -- Flakey tests sometimes fail, sometimes pass
            return True

        not_implemented_versions = getattr(self, 'not_implemented_versions', {})
        if method_name in not_implemented_versions:
            py_version = "%s.%s" % (sys.version_info.major, sys.version_info.minor)
            if py_version in not_implemented_versions[method_name]:
                return True

        return False

    def run(self, result=None):
        # Override the run method to inject the "expectingFailure" marker
        # when the test case runs.
        if self._is_not_implemented():
            # Mark 'expecting failure' on class. It will only be applicable
            # for this specific run.
            method = getattr(self, self._testMethodName)

            def wrapper(*args, **kwargs):
                if self._is_flakey():
                    raise Exception("Flakey test that sometimes fails and sometimes passes")
                return method(*args, **kwargs)

            wrapper.__unittest_expecting_failure__ = True
            setattr(self, self._testMethodName, wrapper)
        return super().run(result=result)
