from ..utils import TranspileTestCase


class TryExceptTests(TranspileTestCase):

    def test_try_except(self):
        # No exception
        self.assertCodeExecution("""
            try:
                obj = 3
                print('OK')
            except:
                print("Got an error")
            print('Done.')
            """)

        # Caught exception
        self.assertCodeExecution("""
            try:
                obj.no_such_attribute
                print('OK')
            except:
                print("Got an error")
            print('Done.')
            """)

    def test_try_except_unnamed(self):
        # No exception
        self.assertCodeExecution("""
            try:
                obj = 3
                print('OK')
            except NameError:
                print("Got an error")
            print('Done.')
            """)

        # Caught exception
        self.assertCodeExecution("""
            try:
                obj.no_such_attribute
                print('OK')
            except NameError:
                print("Got an error")
            print('Done.')
            """)

        # Uncaught exception
        self.assertCodeExecution("""
            try:
                obj = int('asdf')
                print('OK')
            except NameError:
                print("Got an error")
            print('Done.')
            """)

    def test_try_except_named(self):
        # No exception
        self.assertCodeExecution("""
            try:
                obj = 3
                print('OK')
            except NameError as e:
                print("Got a NameError")
            print('Done.')
            """)

        # Caught exception
        self.assertCodeExecution("""
            try:
                obj.no_such_attribute
                print('OK')
            except NameError as e:
                print("Got a NameError")
            print('Done.')
            """)

        # Uncaught exception
        self.assertCodeExecution("""
            try:
                obj = int('asdf')
                print('OK')
            except NameError as e:
                print("Got a NameError")
            print('Done.')
            """)

    def test_try_multiple_except(self):
        # No exception
        self.assertCodeExecution("""
            try:
                obj = 3
                print('OK')
            except NameError:
                print("Got a NameError")
            except AttributeError:
                print("Got an AttributeError")
            print('Done.')
            """)

        # Caught first exception
        self.assertCodeExecution("""
            try:
                obj.no_such_attribute
                print('OK')
            except NameError:
                print("Got a NameError")
            except AttributeError:
                print("Got an AttributeError")
            print('Done.')
            """)

        # Caught second exception
        self.assertCodeExecution("""
            try:
                obj.no_such_attribute
                print('OK')
            except AttributeError:
                print("Got an AttributeError")
            except NameError:
                print("Got a NameError")
            print('Done.')
            """)

        # Uncaught exception
        self.assertCodeExecution("""
            try:
                obj = int('asdf')
                print('OK')
            except NameError:
                print("Got a NameError")
            except AttributeError:
                print("Got an AttributeError")
            print('Done.')
            """)

    def test_try_multiple_except_named(self):
        # No exception
        self.assertCodeExecution("""
            try:
                obj = 3
                print('OK')
            except NameError:
                print("Got a NameError")
            except AttributeError:
                print("Got an AttributeError")
            print('Done.')
            """)

        # Caught first exception
        self.assertCodeExecution("""
            try:
                obj.no_such_attribute
                print('OK')
            except NameError as e:
                print("Got a NameError")
            except AttributeError as e:
                print("Got an AttributeError")
            print('Done.')
            """)

        # Caught second exception
        self.assertCodeExecution("""
            try:
                obj.no_such_attribute
                print('OK')
            except AttributeError as e:
                print("Got an AttributeError")
            except NameError as e:
                print("Got a NameError")
            print('Done.')
            """)

        # Uncaught exception
        self.assertCodeExecution("""
            try:
                obj = int('asdf')
                print('OK')
            except NameError as e:
                print("Got a NameError")
            except AttributeError as e:
                print("Got an AttributeError")
            print('Done.')
            """)

    def test_try_multiple_match_except_unnamed(self):
        # No exception
        self.assertCodeExecution("""
            try:
                obj = 3
                print('OK')
            except (NameError, TypeError):
                print("Got a NameError")
            except AttributeError:
                print("Got an AttributeError")
            print('Done.')
            """)

        # Caught first exception, first handler
        self.assertCodeExecution("""
            try:
                obj.no_such_attribute
                print('OK')
            except (NameError, TypeError):
                print("Got a NameError")
            except AttributeError:
                print("Got an AttributeError")
            print('Done.')
            """)

        # Caught second exception, first handler
        self.assertCodeExecution("""
            try:
                obj.no_such_attribute
                print('OK')
            except (TypeError, NameError):
                print("Got a NameError")
            except AttributeError:
                print("Got an AttributeError")
            print('Done.')
            """)

        # Caught first exception, second handler
        self.assertCodeExecution("""
            try:
                obj.no_such_attribute
                print('OK')
            except AttributeError:
                print("Got an AttributeError")
            except (NameError, TypeError):
                print("Got a NameError")
            print('Done.')
            """)

        # Caught second exception, second handler
        self.assertCodeExecution("""
            try:
                obj.no_such_attribute
                print('OK')
            except AttributeError:
                print("Got an AttributeError")
            except (TypeError, NameError):
                print("Got a NameError")
            print('Done.')
            """)

        # Uncaught exception
        self.assertCodeExecution("""
            try:
                obj = int('asdf')
                print('OK')
            except (NameError, TypeError):
                print("Got a TypeError")
            except AttributeError:
                print("Got an AttributeError")
            print('Done.')
            """)

    def test_try_multiple_match_except_named(self):
        # No exception
        self.assertCodeExecution("""
            try:
                obj = 3
                print('OK')
            except (NameError, TypeError) as e:
                print("Got a NameError")
            except AttributeError as e:
                print("Got an AttributeError")
            print('Done.')
            """)

        # Caught first exception, first handler
        self.assertCodeExecution("""
            try:
                obj.no_such_attribute
                print('OK')
            except (NameError, TypeError) as e:
                print("Got a NameError")
            except AttributeError as e:
                print("Got an AttributeError")
            print('Done.')
            """)

        # Caught second exception, first handler
        self.assertCodeExecution("""
            try:
                obj.no_such_attribute
                print('OK')
            except (TypeError, NameError) as e:
                print("Got a NameError")
            except AttributeError as e:
                print("Got an AttributeError")
            print('Done.')
            """)

        # Caught first exception, second handler
        self.assertCodeExecution("""
            try:
                obj.no_such_attribute
                print('OK')
            except AttributeError as e:
                print("Got an AttributeError")
            except (NameError, TypeError) as e:
                print("Got a NameError")
            print('Done.')
            """)

        # Caught second exception, second handler
        self.assertCodeExecution("""
            try:
                obj.no_such_attribute
                print('OK')
            except AttributeError as e:
                print("Got an AttributeError")
            except (TypeError, NameError) as e:
                print("Got a NameError")
            print('Done.')
            """)

        # Uncaught exception
        self.assertCodeExecution("""
            try:
                obj = int('asdf')
                print('OK')
            except (NameError, TypeError) as e:
                print("Got a TypeError")
            except AttributeError as e:
                print("Got an AttributeError")
            print('Done.')
            """)

    def test_try_multiple_except_mixed1(self):
        # No exception
        self.assertCodeExecution("""
            try:
                obj = 3
                print('OK')
            except NameError:
                print("Got a NameError")
            except AttributeError as e:
                print("Got an AttributeError")
            print('Done.')
            """)

        # Caught exception
        self.assertCodeExecution("""
            try:
                obj.no_such_attribute
                print('OK')
            except NameError:
                print("Got a NameError")
            except AttributeError as e:
                print("Got an AttributeError")
            print('Done.')
            """)

        # Uncaught exception
        self.assertCodeExecution("""
            try:
                obj = int('asdf')
                print('OK')
            except NameError:
                print("Got a NameError")
            except AttributeError as e:
                print("Got an AttributeError")
            print('Done.')
            """)

    def test_try_multiple_except_mixed2(self):
        self.assertCodeExecution("""
            try:
                obj = 3
                print('OK')
            except NameError as e:
                print("Got a NameError")
            except AttributeError:
                print("Got an AttributeError")
            print('Done.')
            """)

        self.assertCodeExecution("""
            try:
                obj.no_such_attribute
                print('OK')
            except NameError as e:
                print("Got a NameError")
            except AttributeError:
                print("Got an AttributeError")
            print('Done.')
            """)

        self.assertCodeExecution("""
            try:
                obj = int('asdf')
                print('OK')
            except NameError as e:
                print("Got a NameError")
            except AttributeError:
                print("Got an AttributeError")
            print('Done.')
            """)

    def test_try_multiple_except_mixed3(self):
        # No exception
        self.assertCodeExecution("""
            try:
                obj = 3
                print('OK')
            except NameError as e:
                print("Got a NameError")
            except AttributeError:
                print("Got an AttributeError")
            except:
                print("Got an anonymous error")
            print('Done.')
            """)

        # Caught exception
        self.assertCodeExecution("""
            try:
                obj.no_such_attribute
                print('OK')
            except NameError as e:
                print("Got a NameError")
            except AttributeError:
                print("Got an AttributeError")
            except:
                print("Got an anonymous error")
            print('Done.')
            """)

        # Caught as bucket case
        self.assertCodeExecution("""
            try:
                obj = int('asdf')
                print('OK')
            except NameError as e:
                print("Got a NameError")
            except AttributeError:
                print("Got an AttributeError")
            except:
                print("Got an anonymous error")
            print('Done.')
            """)


class TryExceptFinallyTests(TranspileTestCase):
    def test_try_finally(self):
        # No exception
        self.assertCodeExecution("""
            try:
                obj = 3
                print('OK')
            finally:
                print("Do final cleanup")
            print('Done.')
            """)

        # Uncaugt Exception
        self.assertCodeExecution("""
            try:
                obj = int('asdf')
                print('OK')
            finally:
                print("Do final cleanup")
            print('Done.')
            """)

    def test_try_except_finally(self):
        # No exception
        self.assertCodeExecution("""
            try:
                obj.no_such_attribute
                print('OK')
            except:
                print("Got an error")
            finally:
                print("Do final cleanup")
            print('Done.')
            """)

        # Caught Exception
        self.assertCodeExecution("""
            try:
                obj.no_such_attribute
                print('OK')
            except:
                print("Got an error")
            finally:
                print("Do final cleanup")
            print('Done.')
            """)

    def test_try_except_unnamed_finally(self):
        # No exception
        self.assertCodeExecution("""
            try:
                obj = 3
                print('OK')
            except NameError:
                print("Got an error")
            finally:
                print("Do final cleanup")
            print('Done.')
            """)

        # Caught exception
        self.assertCodeExecution("""
            try:
                obj.no_such_attribute
                print('OK')
            except NameError:
                print("Got an error")
            finally:
                print("Do final cleanup")
            print('Done.')
            """)

        # Uncaught exception
        self.assertCodeExecution("""
            try:
                obj = int('asdf')
                print('OK')
            except NameError:
                print("Got an error")
            finally:
                print("Do final cleanup")
            print('Done.')
            """)

    def test_try_except_named_finally(self):
        # No exception
        self.assertCodeExecution("""
            try:
                obj.no_such_attribute
                print('OK')
            except NameError as e:
                print("Got a NameError")
            finally:
                print("Do final cleanup")
            print('Done.')
            """)

        # Caught exception
        self.assertCodeExecution("""
            try:
                obj.no_such_attribute
                print('OK')
            except NameError as e:
                print("Got a NameError")
            finally:
                print("Do final cleanup")
            print('Done.')
            """)

        # Uncaught exception
        self.assertCodeExecution("""
            try:
                obj = int('asdf')
                print('OK')
            except NameError as e:
                print("Got a NameError")
            finally:
                print("Do final cleanup")
            print('Done.')
            """)

    def test_try_multiple_except_finally(self):
        # No exception
        self.assertCodeExecution("""
            try:
                obj = 3
                print('OK')
            except NameError:
                print("Got a NameError")
            except AttributeError as e:
                print("Got an AttributeError")
            finally:
                print("Do final cleanup")
            print('Done.')
            """)

        # Caught first exception
        self.assertCodeExecution("""
            try:
                obj.no_such_attribute
                print('OK')
            except NameError:
                print("Got a NameError")
            except AttributeError as e:
                print("Got an AttributeError")
            finally:
                print("Do final cleanup")
            print('Done.')
            """)

        # Caught second exception
        self.assertCodeExecution("""
            try:
                obj.no_such_attribute
                print('OK')
            except AttributeError as e:
                print("Got an AttributeError")
            except NameError:
                print("Got a NameError")
            finally:
                print("Do final cleanup")
            print('Done.')
            """)

        # Uncaught exception
        self.assertCodeExecution("""
            try:
                obj = int('asdf')
                print('OK')
            except NameError:
                print("Got a NameError")
            except AttributeError as e:
                print("Got an AttributeError")
            finally:
                print("Do final cleanup")
            print('Done.')
            """)


class TryExceptElseTests(TranspileTestCase):
    def test_try_except_else(self):
        # No exception
        self.assertCodeExecution("""
            try:
                obj = 3
                print('OK')
            except:
                print("Got an error")
            else:
                print("Do else handling")
            print('Done.')
            """)

        # Caught exception
        self.assertCodeExecution("""
            try:
                obj.no_such_attribute
                print('OK')
            except:
                print("Got an error")
            else:
                print("Do else handling")
            print('Done.')
            """)

    def test_try_except_unnamed_else(self):
        # No exception
        self.assertCodeExecution("""
            try:
                obj.no_such_attribute
                print('OK')
            except NameError:
                print("Got an error")
            else:
                print("Do else handling")
            print('Done.')
            """)

        # Caught exception
        self.assertCodeExecution("""
            try:
                obj.no_such_attribute
                print('OK')
            except NameError:
                print("Got an error")
            else:
                print("Do else handling")
            print('Done.')
            """)

        # Uncaught exception
        self.assertCodeExecution("""
            try:
                obj = int('asdf')
                print('OK')
            except NameError:
                print("Got an error")
            else:
                print("Do else handling")
            print('Done.')
            """)

    def test_try_multiple_except_else(self):
        # No exception
        self.assertCodeExecution("""
            try:
                obj = 3
                print('OK')
            except NameError:
                print("Got a NameError")
            except AttributeError as e:
                print("Got an AttributeError")
            else:
                print("Do else handling")
            print('Done.')
            """)

        # Caught exception
        self.assertCodeExecution("""
            try:
                obj.no_such_attribute
                print('OK')
            except NameError:
                print("Got a NameError")
            except AttributeError as e:
                print("Got an AttributeError")
            else:
                print("Do else handling")
            print('Done.')
            """)

        # Uncaught exception
        self.assertCodeExecution("""
            try:
                obj = int('asdf')
                print('OK')
            except NameError:
                print("Got a NameError")
            except AttributeError as e:
                print("Got an AttributeError")
            else:
                print("Do else handling")
            print('Done.')
            """)


class TryExceptElseFinallyTests(TranspileTestCase):
    def test_try_except_else_finally(self):
        # No exception
        self.assertCodeExecution("""
            try:
                obj = 3
                print('OK')
            except:
                print("Got an error")
            else:
                print("Do else handling")
            finally:
                print("Do final cleanup")
            print('Done.')
            """)

        # Caught exception
        self.assertCodeExecution("""
            try:
                obj.no_such_attribute
                print('OK')
            except:
                print("Got an error")
            else:
                print("Do else handling")
            finally:
                print("Do final cleanup")
            print('Done.')
            """)

    def test_try_except_unnamed_else_finally(self):
        # No exception
        self.assertCodeExecution("""
            try:
                obj = 3
                print('OK')
            except NameError:
                print("Got an error")
            else:
                print("Do else handling")
            finally:
                print("Do final cleanup")
            print('Done.')
            """)

        # Caught exception
        self.assertCodeExecution("""
            try:
                obj.no_such_attribute
                print('OK')
            except NameError:
                print("Got an error")
            else:
                print("Do else handling")
            finally:
                print("Do final cleanup")
            print('Done.')
            """)

        # Uncaught exception
        self.assertCodeExecution("""
            try:
                obj = int('asdf')
                print('OK')
            except NameError:
                print("Got an error")
            else:
                print("Do else handling")
            finally:
                print("Do final cleanup")
            print('Done.')
            """)

    def test_try_multiple_except_else_finally(self):
        # No exception
        self.assertCodeExecution("""
            try:
                obj.no_such_attribute
                print('OK')
            except NameError:
                print("Got a NameError")
            except AttributeError as e:
                print("Got an AttributeError")
            else:
                print("Do else handling")
            finally:
                print("Do final cleanup")
            print('Done.')
            """)

        # Caught exception
        self.assertCodeExecution("""
            try:
                obj.no_such_attribute
                print('OK')
            except NameError:
                print("Got a NameError")
            except AttributeError as e:
                print("Got an AttributeError")
            else:
                print("Do else handling")
            finally:
                print("Do final cleanup")
            print('Done.')
            """)

        # Uncaught exception
        self.assertCodeExecution("""
            try:
                obj = int('asdf')
                print('OK')
            except NameError:
                print("Got a NameError")
            except AttributeError as e:
                print("Got an AttributeError")
            else:
                print("Do else handling")
            finally:
                print("Do final cleanup")
            print('Done.')
            """)
