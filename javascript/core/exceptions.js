/* eslint-disable no-extend-native */
import { call_super, pyargs } from './callables'
import { create_pyclass, PyObject } from './types'

/*****************************************************************
 * Root exception
 *****************************************************************/
export var PyBaseException = class extends PyObject {
    @pyargs({
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
create_pyclass(PyBaseException, 'BaseException')

/*****************************************************************
 * Top level exceptions
 *****************************************************************/

export var PySystemExit = class extends PyObject {}
create_pyclass(PySystemExit, 'SystemExit', [PyBaseException])

export var PyKeyboardInterrupt = class extends PyObject {}
create_pyclass(PyKeyboardInterrupt, 'KeyboardInterrupt', [PyBaseException])

export var PyGeneratorExit = class extends PyObject {}
create_pyclass(PyGeneratorExit, 'GeneratorExit', [PyBaseException])

export var PyException = class extends PyObject {}
create_pyclass(PyException, 'Exception', [PyBaseException])

/*****************************************************************
 * All other exceptions
 *****************************************************************/

export var PyArithmeticError = class extends PyObject {}
create_pyclass(PyArithmeticError, 'ArithmeticError', [PyException])

export var PyAssertionError = class extends PyObject {}
create_pyclass(PyAssertionError, 'AssertionError', [PyException])

export var PyAttributeError = class extends PyObject {}
create_pyclass(PyAttributeError, 'AttributeError', [PyException])

export var PyBufferError = class extends PyObject {}
create_pyclass(PyBufferError, 'BufferError', [PyException])

// PyBytesWarning = undefined

// PyDeprecationWarning = undefined

export var PyEOFError = class extends PyObject {}
create_pyclass(PyEOFError, 'EOFError', [PyException])

export var PyEnvironmentError = class extends PyObject {}
create_pyclass(PyEnvironmentError, 'EnvironmentError', [PyException])

export var PyFloatingPointError = class extends PyObject {}
create_pyclass(PyFloatingPointError, 'FloatingPointError', [PyException])

// PyFutureWarning = undefined

export var PyIOError = class extends PyObject {}
create_pyclass(PyIOError, 'IOError', [PyException])

export var PyImportError = class extends PyObject {}
create_pyclass(PyImportError, 'ImportError', [PyException])

// PyImportWarning = undefined

export var PyIndentationError = class extends PyObject {}
create_pyclass(PyIndentationError, 'IndentationError', [PyException])

export var PyIndexError = class extends PyObject {}
create_pyclass(PyIndexError, 'IndexError', [PyException])

export var PyKeyError = class extends PyObject {
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
        call_super(this, '__init__', [msg])
    }
}
create_pyclass(PyKeyError, 'KeyError', [PyException])

export var PyLookupError = class extends PyObject {}
create_pyclass(PyLookupError, 'LookupError', [PyException])

export var PyMemoryError = class extends PyObject {}
create_pyclass(PyMemoryError, 'MemoryError', [PyException])

export var PyNameError = class extends PyObject {}
create_pyclass(PyNameError, 'NameError', [PyException])

export var PyNotImplementedError = class extends PyObject {}
create_pyclass(PyNotImplementedError, 'NotImplementedError', [PyException])

export var PyOSError = class extends PyObject {}
create_pyclass(PyOSError, 'OSError', [PyException])

export var PyOverflowError = class extends PyObject {}
create_pyclass(PyOverflowError, 'OverflowError', [PyException])

// PyPendingDeprecationWarning = undefined

export var PyReferenceError = class extends PyObject {}
create_pyclass(PyReferenceError, 'ReferenceError', [PyException])

export var PyRuntimeError = class extends PyObject {}
create_pyclass(PyRuntimeError, 'RuntimeError', [PyException])

// PyRuntimeWarning = undefined

export var PyStandardError = class extends PyObject {}
create_pyclass(PyStandardError, 'StandardError', [PyException])

export var PyStopIteration = class extends PyObject {}
create_pyclass(PyStopIteration, 'StopIteration', [PyException])

export var PySyntaxError = class extends PyObject {}
create_pyclass(PySyntaxError, 'SyntaxError', [PyException])

// PySyntaxWarning = undefined

export var PySystemError = class extends PyObject {}
create_pyclass(PySystemError, 'SystemError', [PyException])

export var PyTabError = class extends PyObject {}
create_pyclass(PyTabError, 'TabError', [PyException])

export var PyTypeError = class extends PyObject {}
create_pyclass(PyTypeError, 'TypeError', [PyException])

export var PyUnboundLocalError = class extends PyObject {}
create_pyclass(PyUnboundLocalError, 'UnboundLocalError', [PyException])

export var PyUnicodeDecodeError = class extends PyObject {}
create_pyclass(PyUnicodeDecodeError, 'UnicodeDecodeError', [PyException])

export var PyUnicodeEncodeError = class extends PyObject {}
create_pyclass(PyUnicodeEncodeError, 'UnicodeEncodeError', [PyException])

export var PyUnicodeError = class extends PyObject {}
create_pyclass(PyUnicodeError, 'UnicodeError', [PyException])

export var PyUnicodeTranslateError = class extends PyObject {}
create_pyclass(PyUnicodeTranslateError, 'UnicodeTranslateError', [PyException])

// PyUnicodeWarning = undefined

// PyUserWarning = undefined

export var PyValueError = class extends PyObject {}
create_pyclass(PyValueError, 'ValueError', [PyException])

// Warning = undefined

export var PyZeroDivisionError = class extends PyObject {}
create_pyclass(PyZeroDivisionError, 'ZeroDivisionError', [PyException])

/*****************************************************************
 * Specialist Batavia exceptions
 *****************************************************************/

export var PyBataviaError = class extends PyObject {}
create_pyclass(PyBataviaError, 'BataviaError', [PyException])

export var PyPolyglotError = class extends PyObject {}
create_pyclass(PyPolyglotError, 'PolyglotError', [PyException])
