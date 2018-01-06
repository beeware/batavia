/* eslint-disable no-extend-native */
import { create_pyclass, Type, PyObject } from './types'

/*****************************************************************
 * Root exception
 *****************************************************************/
export var BaseException = class extends PyObject {
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
create_pyclass(BaseException, 'BaseException')

/*****************************************************************
 * Top level exceptions
 *****************************************************************/

export var SystemExit = class extends BaseException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(SystemExit, 'SystemExit', BaseException)

export var KeyboardInterrupt = class extends BaseException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(KeyboardInterrupt, 'KeyboardInterrupt', BaseException)

export var GeneratorExit = class extends BaseException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(GeneratorExit, 'GeneratorExit', BaseException)

export var Exception = class extends BaseException {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(Exception, 'Exception', BaseException)

/*****************************************************************
 * All other exceptions
 *****************************************************************/

export var BataviaError = class extends Exception {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(BataviaError, 'BataviaError', Exception)

export var ArithmeticError = class extends Exception {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(ArithmeticError, 'ArithmeticError', Exception)

export var AssertionError = class extends Exception {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(AssertionError, 'AssertionError', Exception)

export var AttributeError = class extends Exception {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(AttributeError, 'AttributeError', Exception)

export var BufferError = class extends Exception {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(BufferError, 'BufferError', Exception)

// BytesWarning = undefined

// DeprecationWarning = undefined

export var EOFError = class extends Exception {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(EOFError, 'EOFError', Exception)

export var EnvironmentError = class extends Exception {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(EnvironmentError, 'EnvironmentError', Exception)

export var FloatingPointError = class extends Exception {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(FloatingPointError, 'FloatingPointError', Exception)

// FutureWarning = undefined

export var IOError = class extends Exception {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(IOError, 'IOError', Exception)

export var ImportError = class extends Exception {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(ImportError, 'ImportError', Exception)

// ImportWarning = undefined

export var IndentationError = class extends Exception {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(IndentationError, 'IndentationError', Exception)

export var IndexError = class extends Exception {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(IndexError, 'IndexError', Exception)

export var KeyError = class extends Exception {
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
create_pyclass(KeyError, 'KeyError', Exception)

export var LookupError = class extends Exception {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(LookupError, 'LookupError', Exception)

export var MemoryError = class extends Exception {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(MemoryError, 'MemoryError', Exception)

export var NameError = class extends Exception {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(NameError, 'NameError', Exception)

export var NotImplementedError = class extends Exception {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(NotImplementedError, 'NotImplementedError', Exception)

export var OSError = class extends Exception {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(OSError, 'OSError', Exception)

export var OverflowError = class extends Exception {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(OverflowError, 'OverflowError', Exception)

// PendingDeprecationWarning = undefined

export var PolyglotError = class extends Exception {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(PolyglotError, 'PolyglotError', Exception)

export var ReferenceError = class extends Exception {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(ReferenceError, 'ReferenceError', Exception)

export var RuntimeError = class extends Exception {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(RuntimeError, 'RuntimeError', Exception)

// RuntimeWarning = undefined

export var StandardError = class extends Exception {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(StandardError, 'StandardError', Exception)

export var StopIteration = class extends Exception {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(StopIteration, 'StopIteration', Exception)

export var SyntaxError = class extends Exception {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(SyntaxError, 'SyntaxError', Exception)

// SyntaxWarning = undefined

export var SystemError = class extends Exception {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(SystemError, 'SystemError', Exception)

export var TabError = class extends Exception {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(TabError, 'TabError', Exception)

export var TypeError = class extends Exception {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(TypeError, 'TypeError', Exception)

export var UnboundLocalError = class extends Exception {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(UnboundLocalError, 'UnboundLocalError', Exception)

export var UnicodeDecodeError = class extends Exception {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(UnicodeDecodeError, 'UnicodeDecodeError', Exception)

export var UnicodeEncodeError = class extends Exception {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(UnicodeEncodeError, 'UnicodeEncodeError', Exception)

export var UnicodeError = class extends Exception {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(UnicodeError, 'UnicodeError', Exception)

export var UnicodeTranslateError = class extends Exception {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(UnicodeTranslateError, 'UnicodeTranslateError', Exception)

// UnicodeWarning = undefined

// UserWarning = undefined

export var ValueError = class extends Exception {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(ValueError, 'ValueError', Exception)

// Warning = undefined

export var ZeroDivisionError = class extends Exception {
    constructor(msg) {
        super(msg)
    }
}
create_pyclass(ZeroDivisionError, 'ZeroDivisionError', Exception)
