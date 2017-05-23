import unittest

from ..utils import TranspileTestCase


class HashlibTests:
    @unittest.expectedFailure
    def test_digest(self):
        self.assertCodeExecution("""
            import hashlib
            m = hashlib.%s()
            m.update(b"Nobody inspects")
            m.update(b" the spammish repetition")
            print(m.digest())
            """ % self.ALGORITHM)

    @unittest.expectedFailure
    def test_hexdigest(self):
        self.assertCodeExecution("""
            import hashlib
            print(hashlib.%s(b"Nobody inspects the spammish repetition").hexdigest())
            """ % self.ALGORITHM)


class MD5Tests(TranspileTestCase, HashlibTests):
    ALGORITHM = 'md5'


class SHA1Tests(TranspileTestCase, HashlibTests):
    ALGORITHM = 'sha1'


class SHA224Tests(TranspileTestCase, HashlibTests):
    ALGORITHM = 'sha224'


class SHA256Tests(TranspileTestCase, HashlibTests):
    ALGORITHM = 'sha256'


class SHA384Tests(TranspileTestCase, HashlibTests):
    ALGORITHM = 'sha384'


class SHA512Tests(TranspileTestCase, HashlibTests):
    ALGORITHM = 'sha512'
