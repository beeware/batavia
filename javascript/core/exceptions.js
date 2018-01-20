/* eslint-disable no-extend-native */
import { call_super, python } from './callables'
import { create_pyclass, PyObject } from './types'

/*****************************************************************
 * Root exception
 *****************************************************************/
export var BaseException = class extends PyObject {
    @python({
        args: ['msg']
    })
    __init__(msg) {
        super.__init__()
        this.msg = msg
    }

    __str__() {
        if (this.msg) {
            return this.msg
        } else {
            return ''
        }
    }

    __repr__() {
        if (this.msg) {
            return this.__class__.__name__ + '(' + this.msg + ')'
        } else {
            return this.__class__.__name__ + '()'
        }
    }
}
create_pyclass(BaseException, 'BaseException')

/*****************************************************************
 * Top level exceptions
 *****************************************************************/

export var SystemExit = class extends PyObject {}
create_pyclass(SystemExit, 'SystemExit', [BaseException])

export var KeyboardInterrupt = class extends PyObject {}
create_pyclass(KeyboardInterrupt, 'KeyboardInterrupt', [BaseException])

export var GeneratorExit = class extends PyObject {}
create_pyclass(GeneratorExit, 'GeneratorExit', [BaseException])

export var Exception = class extends PyObject {}
create_pyclass(Exception, 'Exception', [BaseException])

/*****************************************************************
 * All other exceptions
 *****************************************************************/

export var BataviaError = class extends PyObject {}
create_pyclass(BataviaError, 'BataviaError', [Exception])

export var ArithmeticError = class extends PyObject {}
create_pyclass(ArithmeticError, 'ArithmeticError', [Exception])

export var AssertionError = class extends PyObject {}
create_pyclass(AssertionError, 'AssertionError', [Exception])

export var AttributeError = class extends PyObject {}
create_pyclass(AttributeError, 'AttributeError', [Exception])

export var BufferError = class extends PyObject {}
create_pyclass(BufferError, 'BufferError', [Exception])

// PyBytesWarning = undefined

// PyDeprecationWarning = undefined

export var EOFError = class extends PyObject {}
create_pyclass(EOFError, 'EOFError', [Exception])

export var EnvironmentError = class extends PyObject {}
create_pyclass(EnvironmentError, 'EnvironmentError', [Exception])

export var FloatingPointError = class extends PyObject {}
create_pyclass(FloatingPointError, 'FloatingPointError', [Exception])

// PyFutureWarning = undefined

export var IOError = class extends PyObject {}
create_pyclass(IOError, 'IOError', [Exception])

export var ImportError = class extends PyObject {}
create_pyclass(ImportError, 'ImportError', [Exception])

// PyImportWarning = undefined

export var IndentationError = class extends PyObject {}
create_pyclass(IndentationError, 'IndentationError', [Exception])

export var IndexError = class extends PyObject {}
create_pyclass(IndexError, 'IndexError', [Exception])

export var KeyError = class extends PyObject {
    __init__(key) {
        var msg = ''
        if (key === null) {
            msg = 'None'
        } else if (key !== undefined) {
            if (key['__repr__'] && !key.hasOwnProperty('__repr__')) {
                msg = key.__repr__()
            } else {
                msg = key.toString()
            }
        }
        call_super(this, '__init__', msg)
    }
}
create_pyclass(KeyError, 'KeyError', [Exception])

export var LookupError = class extends PyObject {}
create_pyclass(LookupError, 'LookupError', [Exception])

export var MemoryError = class extends PyObject {}
create_pyclass(MemoryError, 'MemoryError', [Exception])

export var NameError = class extends PyObject {}
create_pyclass(NameError, 'NameError', [Exception])

export var NotImplementedError = class extends PyObject {}
create_pyclass(NotImplementedError, 'NotImplementedError', [Exception])

export var OSError = class extends PyObject {}
create_pyclass(OSError, 'OSError', [Exception])

export var OverflowError = class extends PyObject {}
create_pyclass(OverflowError, 'OverflowError', [Exception])

// PyPendingDeprecationWarning = undefined

export var PolyglotError = class extends PyObject {}
create_pyclass(PolyglotError, 'PolyglotError', [Exception])

export var ReferenceError = class extends PyObject {}
create_pyclass(ReferenceError, 'ReferenceError', [Exception])

export var RuntimeError = class extends PyObject {}
create_pyclass(RuntimeError, 'RuntimeError', [Exception])

// PyRuntimeWarning = undefined

export var StandardError = class extends PyObject {}
create_pyclass(StandardError, 'StandardError', [Exception])

export var StopIteration = class extends PyObject {}
create_pyclass(StopIteration, 'StopIteration', [Exception])

export var SyntaxError = class extends PyObject {}
create_pyclass(SyntaxError, 'SyntaxError', [Exception])

// PySyntaxWarning = undefined

export var SystemError = class extends PyObject {}
create_pyclass(SystemError, 'SystemError', [Exception])

export var TabError = class extends PyObject {}
create_pyclass(TabError, 'TabError', [Exception])

export var TypeError = class extends PyObject {}
create_pyclass(TypeError, 'TypeError', [Exception])

export var UnboundLocalError = class extends PyObject {}
create_pyclass(UnboundLocalError, 'UnboundLocalError', [Exception])

export var UnicodeDecodeError = class extends PyObject {}
create_pyclass(UnicodeDecodeError, 'UnicodeDecodeError', [Exception])

export var UnicodeEncodeError = class extends PyObject {}
create_pyclass(UnicodeEncodeError, 'UnicodeEncodeError', [Exception])

export var UnicodeError = class extends PyObject {}
create_pyclass(UnicodeError, 'UnicodeError', [Exception])

export var UnicodeTranslateError = class extends PyObject {}
create_pyclass(UnicodeTranslateError, 'UnicodeTranslateError', [Exception])

// PyUnicodeWarning = undefined

// PyUserWarning = undefined

export var ValueError = class extends PyObject {}
create_pyclass(ValueError, 'ValueError', [Exception])

// Warning = undefined

export var ZeroDivisionError = class extends PyObject {}
create_pyclass(ZeroDivisionError, 'ZeroDivisionError', [Exception])
