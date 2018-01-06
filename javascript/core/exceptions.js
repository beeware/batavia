/* eslint-disable no-extend-native */
import { create_pyclass, PyObject } from './types'

/*****************************************************************
 * Root exception
 *****************************************************************/
export var PyBaseException = class extends PyObject {
    constructor(msg) {
        super()
        this.msg = msg
    }

    toString() {
        return this.__str__()
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

export var PySystemExit = class extends PyBaseException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PySystemExit, 'SystemExit', PyBaseException)

export var PyKeyboardInterrupt = class extends PyBaseException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PyKeyboardInterrupt, 'KeyboardInterrupt', PyBaseException)

export var PyGeneratorExit = class extends PyBaseException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PyGeneratorExit, 'GeneratorExit', PyBaseException)

export var PyException = class extends PyBaseException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PyException, 'Exception', PyBaseException)

/*****************************************************************
 * All other exceptions
 *****************************************************************/

export var BataviaError = class extends PyException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(BataviaError, 'BataviaError', PyException)

export var PyArithmeticError = class extends PyException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PyArithmeticError, 'PyArithmeticError', PyException)

export var PyAssertionError = class extends PyException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PyAssertionError, 'AssertionError', PyException)

export var PyAttributeError = class extends PyException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PyAttributeError, 'AttributeError', PyException)

export var PyBufferError = class extends PyException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PyBufferError, 'BufferError', PyException)

// PyBytesWarning = undefined

// PyDeprecationWarning = undefined

export var PyEOFError = class extends PyException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PyEOFError, 'EOFError', PyException)

export var PyEnvironmentError = class extends PyException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PyEnvironmentError, 'EnvironmentError', PyException)

export var PyFloatingPointError = class extends PyException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PyFloatingPointError, 'FloatingPointError', PyException)

// PyFutureWarning = undefined

export var PyIOError = class extends PyException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PyIOError, 'IOError', PyException)

export var PyImportError = class extends PyException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PyImportError, 'ImportError', PyException)

// PyImportWarning = undefined

export var PyIndentationError = class extends PyException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PyIndentationError, 'IndentationError', PyException)

export var PyIndexError = class extends PyException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PyIndexError, 'IndexError', PyException)

export var PyKeyError = class extends PyException {
    constructor(key) {
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
        super(msg)
    }
}
create_pyclass(PyKeyError, 'KeyError', PyException)

export var PyLookupError = class extends PyException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PyLookupError, 'LookupError', PyException)

export var PyMemoryError = class extends PyException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PyMemoryError, 'MemoryError', PyException)

export var PyNameError = class extends PyException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PyNameError, 'NameError', PyException)

export var PyNotImplementedError = class extends PyException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PyNotImplementedError, 'NotImplementedError', PyException)

export var PyOSError = class extends PyException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PyOSError, 'OSError', PyException)

export var PyOverflowError = class extends PyException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PyOverflowError, 'OverflowError', PyException)

// PyPendingDeprecationWarning = undefined

export var PolyglotError = class extends PyException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PolyglotError, 'PolyglotError', PyException)

export var PyReferenceError = class extends PyException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PyReferenceError, 'ReferenceError', PyException)

export var PyRuntimeError = class extends PyException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PyRuntimeError, 'RuntimeError', PyException)

// PyRuntimeWarning = undefined

export var PyStandardError = class extends PyException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PyStandardError, 'StandardError', PyException)

export var PyStopIteration = class extends PyException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PyStopIteration, 'PyStopIteration', PyException)

export var PySyntaxError = class extends PyException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PySyntaxError, 'SyntaxError', PyException)

// PySyntaxWarning = undefined

export var PySystemError = class extends PyException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PySystemError, 'SystemError', PyException)

export var PyTabError = class extends PyException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PyTabError, 'TabError', PyException)

export var PyTypeError = class extends PyException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PyTypeError, 'TypeError', PyException)

export var PyUnboundLocalError = class extends PyException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PyUnboundLocalError, 'UnboundLocalError', PyException)

export var PyUnicodeDecodeError = class extends PyException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PyUnicodeDecodeError, 'UnicodeDecodeError', PyException)

export var PyUnicodeEncodeError = class extends PyException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PyUnicodeEncodeError, 'UnicodeEncodeError', PyException)

export var PyUnicodeError = class extends PyException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PyUnicodeError, 'UnicodeError', PyException)

export var PyUnicodeTranslateError = class extends PyException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PyUnicodeTranslateError, 'UnicodeTranslateError', PyException)

// PyUnicodeWarning = undefined

// PyUserWarning = undefined

export var PyValueError = class extends PyException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PyValueError, 'ValueError', PyException)

// Warning = undefined

export var PyZeroDivisionError = class extends PyException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PyZeroDivisionError, 'ZeroDivisionError', PyException)
