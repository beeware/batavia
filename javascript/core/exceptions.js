/* eslint-disable no-extend-native */
import { pyargs } from './callables'
import { jstype, PyObject } from './types'

/*****************************************************************
 * Root exception
 *****************************************************************/
let PyBaseException = class extends PyObject {
    @pyargs({
        default_args: ['msg']
    })
    __init__(msg) {
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
export const pyBaseException = jstype(PyBaseException, 'BaseException')

/************************************************************
 Top level exceptions
 *****************************************************************/

let PySystemExit = class extends PyObject {}
export const pySystemExit = jstype(PySystemExit, 'SystemExit', [pyBaseException])

let PyKeyboardInterrupt = class extends PyObject {}
export const pyKeyboardInterrupt = jstype(PyKeyboardInterrupt, 'KeyboardInterrupt', [pyBaseException])

let PyGeneratorExit = class extends PyObject {}
export const pyGeneratorExit = jstype(PyGeneratorExit, 'GeneratorExit', [pyBaseException])

let PyException = class extends PyObject {}
export const pyException = jstype(PyException, 'Exception', [pyBaseException])

/*****************************************************************
 * All other exceptions
 *****************************************************************/

let PyStopIteration = class extends PyObject {}
export const pyStopIteration = jstype(PyStopIteration, 'StopIteration', [pyException])

let PyStopAsyncIteration = class extends PyObject {}
export const pyStopAsyncIteration = jstype(PyStopAsyncIteration, 'StopAsyncIteration', [pyException])

/*****************************************************************/

let PyArithmeticError = class extends PyObject {}
export const pyArithmeticError = jstype(PyArithmeticError, 'ArithmeticError', [pyException])

let PyFloatingPointError = class extends PyObject {}
export const pyFloatingPointError = jstype(PyFloatingPointError, 'FloatingPointError', [pyArithmeticError])

let PypyOverflowError = class extends PyObject {}
export const pyOverflowError = jstype(PypyOverflowError, 'OverflowError', [pyArithmeticError])

let PyZeroDivisionError = class extends PyObject {}
export const pyZeroDivisionError = jstype(PyZeroDivisionError, 'ZeroDivisionError', [pyArithmeticError])

/*****************************************************************/

let PyAssertionError = class extends PyObject {}
export const pyAssertionError = jstype(PyAssertionError, 'AssertionError', [pyException])

let PyAttributeError = class extends PyObject {}
export const pyAttributeError = jstype(PyAttributeError, 'AttributeError', [pyException])

let PyBufferError = class extends PyObject {}
export const pyBufferError = jstype(PyBufferError, 'BufferError', [pyException])

let PyEOFError = class extends PyObject {}
export const pyEOFError = jstype(PyEOFError, 'EOFError', [pyException])

/*****************************************************************/

let PyImportError = class extends PyObject {}
export const pyImportError = jstype(PyImportError, 'ImportError', [pyException])

let PyModuleNotFoundError = class extends PyObject {}
export const pyModuleNotFoundError = jstype(PyModuleNotFoundError, 'ImportError', [pyImportError])

/*****************************************************************/

let PyLookupError = class extends PyObject {}
export const pyLookupError = jstype(PyLookupError, 'LookupError', [pyException])

let PyIndexError = class extends PyObject {}
export const pyIndexError = jstype(PyIndexError, 'IndexError', [pyLookupError])

let PyKeyError = class extends PyObject {
    __init__(key) {
        var msg = ''
        if (key === null) {
            msg = 'pyNone'
        } else if (key !== undefined) {
            if (key['__repr__'] && !key.hasOwnProperty('__repr__')) {
                msg = key.__repr__()
            } else {
                msg = key.toString()
            }
        }
        this.__init__(msg)
    }
}
export const pyKeyError = jstype(PyKeyError, 'KeyError', [pyLookupError])

/*****************************************************************/

let PyMemoryError = class extends PyObject {}
export const pyMemoryError = jstype(PyMemoryError, 'MemoryError', [pyException])

/*****************************************************************/

let PyNameError = class extends PyObject {}
export const pyNameError = jstype(PyNameError, 'NameError', [pyException])

let PyUnboundLocalError = class extends PyObject {}
export const pyUnboundLocalError = jstype(PyUnboundLocalError, 'UnboundLocalError', [pyNameError])

/*****************************************************************/

let PyOSError = class extends PyObject {}
export const pyOSError = jstype(PyOSError, 'OSError', [pyException])

let PyBlockingIOError = class extends PyObject {}
export const pyBlockingIOError = jstype(PyBlockingIOError, 'BlockingIOError', [pyOSError])

let PyChildProcessError = class extends PyObject {}
export const pyChildProcessError = jstype(PyChildProcessError, 'ChildProcessError', [pyOSError])

/* ------------------------------------------------------------- */

let PyConnectionError = class extends PyObject {}
export const pyConnectionError = jstype(PyConnectionError, 'ConnectionError', [pyOSError])

let PyBrokenPipeError = class extends PyObject {}
export const pyBrokenPipeError = jstype(PyBrokenPipeError, 'BrokenPipeError', [pyConnectionError])

let PyConnectionAbortedError = class extends PyObject {}
export const pyConnectionAbortedError = jstype(PyConnectionAbortedError, 'ConnectionAbortedError', [pyConnectionError])

let PyConnectionRefusedError = class extends PyObject {}
export const pyConnectionRefusedError = jstype(PyConnectionRefusedError, 'ConnectionRefusedError', [pyConnectionError])

let PyConnectionResetError = class extends PyObject {}
export const pyConnectionResetError = jstype(PyConnectionResetError, 'ConnectionResetError', [pyConnectionError])

/* ------------------------------------------------------------- */

let PyFileExists = class extends PyObject {}
export const pyFileExists = jstype(PyFileExists, 'FileExists', [pyOSError])

let PyFileNotFoundError = class extends PyObject {}
export const pyFileNotFoundError = jstype(PyFileNotFoundError, 'FileNotFoundError', [pyOSError])

let PyInterruptedError = class extends PyObject {}
export const pyInterruptedError = jstype(PyInterruptedError, 'InterruptedError', [pyOSError])

let PyIsADirectoryError = class extends PyObject {}
export const pyIsADirectoryError = jstype(PyIsADirectoryError, 'IsADirectoryError', [pyOSError])

let PyNotADirectoryError = class extends PyObject {}
export const pyNotADirectoryError = jstype(PyNotADirectoryError, 'NotADirectoryError', [pyOSError])

let PyPermissionError = class extends PyObject {}
export const pyPermissionError = jstype(PyPermissionError, 'NotADirectoryError', [pyOSError])

let PyProcessLookupError = class extends PyObject {}
export const pyProcessLookupError = jstype(PyProcessLookupError, 'ProcessLookupError', [pyOSError])

let PyTimeoutError = class extends PyObject {}
export const pyTimeoutError = jstype(PyTimeoutError, 'TimeoutError', [pyOSError])

/*****************************************************************/

let PyReferenceError = class extends PyObject {}
export const pyReferenceError = jstype(PyReferenceError, 'ReferenceError', [pyException])

/*****************************************************************/

let PyRuntimeError = class extends PyObject {}
export const pyRuntimeError = jstype(PyRuntimeError, 'RuntimeError', [pyException])

let PyNotImplementedError = class extends PyObject {}
export const pyNotImplementedError = jstype(PyNotImplementedError, 'NotImplementedError', [pyRuntimeError])

let PyRecursionError = class extends PyObject {}
export const pyRecursionError = jstype(PyRecursionError, 'RecursionError', [pyRuntimeError])

/*****************************************************************/

let PySyntaxError = class extends PyObject {}
export const pySyntaxError = jstype(PySyntaxError, 'SyntaxError', [pyException])

let PyIndentationError = class extends PyObject {}
export const pyIndentationError = jstype(PyIndentationError, 'IndentationError', [pySyntaxError])

let PyTabError = class extends PyObject {}
export const pyTabError = jstype(PyTabError, 'TabError', [pyIndentationError])

/*****************************************************************/

let PySystemError = class extends PyObject {}
export const pySystemError = jstype(PySystemError, 'SystemError', [pyException])

let PyTypeError = class extends PyObject {}
export const pyTypeError = jstype(PyTypeError, 'TypeError', [pyException])

/*****************************************************************/

let PyValueError = class extends PyObject {}
export const pyValueError = jstype(PyValueError, 'ValueError', [pyException])

let PyUnicodeError = class extends PyObject {}
export const pyUnicodeError = jstype(PyUnicodeError, 'UnicodeError', [pyValueError])

let PyUnicodeDecodeError = class extends PyObject {}
export const pyUnicodeDecodeError = jstype(PyUnicodeDecodeError, 'UnicodeDecodeError', [pyUnicodeError])

let PyUnicodeEncodeError = class extends PyObject {}
export const pyUnicodeEncodeError = jstype(PyUnicodeEncodeError, 'UnicodeEncodeError', [pyUnicodeError])

let PyUnicodeTranslateError = class extends PyObject {}
export const pyUnicodeTranslateError = jstype(PyUnicodeTranslateError, 'UnicodeTranslateError', [pyUnicodeError])

/*****************************************************************/

let PyWarning = class extends PyObject {}
export const pyWarning = jstype(PyWarning, 'Warning', [pyException])

let PyDeprecationWarning = class extends PyObject {}
export const pyDeprecationWarning = jstype(PyDeprecationWarning, 'DeprecationWarning', [pyWarning])

let PyPendingDeprecationWarning = class extends PyObject {}
export const pyPendingDeprecationWarning = jstype(PyPendingDeprecationWarning, 'PendingDeprecationWarning', [pyWarning])

let PyRuntimeWarning = class extends PyObject {}
export const pyRuntimeWarning = jstype(PyRuntimeWarning, 'RuntimeWarning', [pyWarning])

let PySyntaxWarning = class extends PyObject {}
export const pySyntaxWarning = jstype(PySyntaxWarning, 'SyntaxWarning', [pyWarning])

let PyUserWarning = class extends PyObject {}
export const pyUserWarning = jstype(PyUserWarning, 'UserWarning', [pyWarning])

let PyFutureWarning = class extends PyObject {}
export const pyFutureWarning = jstype(PyFutureWarning, 'FutureWarning', [pyWarning])

let PyImportWarning = class extends PyObject {}
export const pyImportWarning = jstype(PyImportWarning, 'ImportWarning', [pyWarning])

let PyUnicodeWarning = class extends PyObject {}
export const pyUnicodeWarning = jstype(PyUnicodeWarning, 'UnicodeWarning', [pyWarning])

let PyBytesWarning = class extends PyObject {}
export const pyBytesWarning = jstype(PyBytesWarning, 'BytesWarning', [pyWarning])

let PyResourceWarning = class extends PyObject {}
export const pyResourceWarning = jstype(PyResourceWarning, 'ResourceWarning', [pyWarning])

/*****************************************************************
 * Specialist Batavia exceptions
 *****************************************************************/

let PyBataviaError = class extends PyObject {}
export const pyBataviaError = jstype(PyBataviaError, 'BataviaError', [pyException])

let PyPolyglotError = class extends PyObject {}
export const pyPolyglotError = jstype(PyPolyglotError, 'PolyglotError', [pyException])
