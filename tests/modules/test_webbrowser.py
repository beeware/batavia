from ..utils import TranspileTestCase


class WebbrowserTests(TranspileTestCase):
    def test_import(self):
        self.assertCodeExecution("""
            import webbrowser
            print('Done.')
            """)
