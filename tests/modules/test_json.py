from ..utils import TranspileTestCase


# TODO(abonie): deal with boilerplate
class JSONEncoderTests(TranspileTestCase):
    def test_encode_type(self):

        self.assertCodeExecution("""
            import json
            enc = json.JSONEncoder()
            print(type(enc.encode("str")))
            print(type(enc.encode({})))
            print(type(enc.encode([])))
            print(type(enc.encode(1)))
            print(type(enc.encode(1.5)))
            print(type(enc.encode((4, 2))))
            print(type(enc.encode(None)))
            print(type(enc.encode(True)))
        """)

    def test_encode_with_defaults(self):

        # None
        self.assertCodeExecution("""
            import json
            print(json.JSONEncoder().encode(None))
        """)

        # Int
        self.assertCodeExecution("""
            import json
            print(json.JSONEncoder().encode(1000000))
        """)

        # Tuple of floats
        self.assertCodeExecution("""
            import json
            print(json.JSONEncoder().encode((1.0, 2.0, 3.0)))
        """)

        # Dict
        self.assertCodeExecution("""
            import json
            print(json.JSONEncoder().encode({'a': 1}))
        """)

        # Bool
        self.assertCodeExecution("""
            import json
            print(json.JSONEncoder().encode(True))
        """)

        # List of bools and strs
        self.assertCodeExecution("""
            import json
            print(json.JSONEncoder().encode([True, False, "Maybe"]))
        """)
