/* eslint-disable no-extend-native */
import { Type } from './types/types'
import { PyObject } from './types/object'

/*****************************************************************
 * Root exception
 *****************************************************************/
export function BaseException(name, msg) {
    PyObject.call(this)
    this.name = name
    this.msg = msg
}

BaseException.prototype = Object.create(PyObject.prototype)
BaseException.prototype.__class__ = new Type('BaseException')
BaseException.prototype.__class__.$pyclass = BaseException

BaseException.prototype.toString = function() {
    return this.__str__()
}

BaseException.prototype.__str__ = function() {
    if (this.msg) {
        return this.msg
    } else {
        return ''
    }
}

BaseException.prototype.__repr__ = function() {
    if (this.msg) {
        return this.name + '(' + this.msg + ')'
    } else {
        return this.name + '()'
    }
}

/*****************************************************************
 * Top level exceptions
 *****************************************************************/

export function SystemExit(msg) {
    BaseException.call(this, 'SystemExit', msg)
}
SystemExit.prototype = Object.create(BaseException.prototype)
SystemExit.prototype.__class__ = new Type('SystemExit', [BaseException.prototype.__class__])
SystemExit.prototype.__class__.$pyclass = SystemExit

export function KeyboardInterrupt(msg) {
    BaseException.call(this, 'KeyboardInterrupt', msg)
}
KeyboardInterrupt.prototype = Object.create(BaseException.prototype)
KeyboardInterrupt.prototype.__class__ = new Type('KeyboardInterrupt', [BaseException.prototype.__class__])
KeyboardInterrupt.prototype.__class__.$pyclass = KeyboardInterrupt

export function GeneratorExit(msg) {
    BaseException.call(this, 'GeneratorExit', msg)
}
GeneratorExit.prototype = Object.create(BaseException.prototype)
GeneratorExit.prototype.__class__ = new Type('GeneratorExit', [BaseException.prototype.__class__])
GeneratorExit.prototype.__class__.$pyclass = GeneratorExit

export function Exception(name, msg) {
    if (arguments.length === 1) {
        // If only one argument is provided, it will be the message.
        BaseException.call(this, 'Exception', name)
    } else {
        BaseException.call(this, name, msg)
    }
}
Exception.prototype = Object.create(BaseException.prototype)
Exception.prototype.__class__ = new Type('Exception', [BaseException.prototype.__class__])
Exception.prototype.__class__.$pyclass = Exception

/*****************************************************************
 * All other exceptions
 *****************************************************************/

export function BataviaError(msg) {
    Exception.call(this, 'BataviaError', msg)
}
BataviaError.prototype = Object.create(Exception.prototype)
BataviaError.prototype.__class__ = new Type('BataviaError', [Exception.prototype.__class__])
BataviaError.prototype.__class__.$pyclass = BataviaError

export function ArithmeticError(msg) {
    Exception.call(this, 'ArithmeticError', msg)
}
ArithmeticError.prototype = Object.create(Exception.prototype)
ArithmeticError.prototype.__class__ = new Type('ArithmeticError', [Exception.prototype.__class__])
ArithmeticError.prototype.__class__.$pyclass = ArithmeticError

export function AssertionError(msg) {
    Exception.call(this, 'AssertionError', msg)
}
AssertionError.prototype = Object.create(Exception.prototype)
AssertionError.prototype.__class__ = new Type('AssertionError', [Exception.prototype.__class__])
AssertionError.prototype.__class__.$pyclass = AssertionError

export function AttributeError(msg) {
    Exception.call(this, 'AttributeError', msg)
}
AttributeError.prototype = Object.create(Exception.prototype)
AttributeError.prototype.__class__ = new Type('AttributeError', [Exception.prototype.__class__])
AttributeError.prototype.__class__.$pyclass = AttributeError

export function BufferError(msg) {
    Exception.call(this, 'BufferError', msg)
}
BufferError.prototype = Object.create(Exception.prototype)
BufferError.prototype.__class__ = new Type('BufferError', [Exception.prototype.__class__])
BufferError.prototype.__class__.$pyclass = BufferError

// BytesWarning = undefined

// DeprecationWarning = undefined

export function EOFError(msg) {
    Exception.call(this, 'EOFError', msg)
}
EOFError.prototype = Object.create(Exception.prototype)
EOFError.prototype.__class__ = new Type('EOFError', [Exception.prototype.__class__])
EOFError.prototype.__class__.$pyclass = EOFError

export function EnvironmentError(msg) {
    Exception.call(this, 'EnvironmentError', msg)
}
EnvironmentError.prototype = Object.create(Exception.prototype)
EnvironmentError.prototype.__class__ = new Type('EnvironmentError', [Exception.prototype.__class__])
EnvironmentError.prototype.__class__.$pyclass = EnvironmentError

export function FloatingPointError(msg) {
    Exception.call(this, 'FloatingPointError', msg)
}
FloatingPointError.prototype = Object.create(Exception.prototype)
FloatingPointError.prototype.__class__ = new Type('FloatingPointError', [Exception.prototype.__class__])
FloatingPointError.prototype.__class__.$pyclass = FloatingPointError

// FutureWarning = undefined

export function IOError(msg) {
    Exception.call(this, 'IOError', msg)
}
IOError.prototype = Object.create(Exception.prototype)
IOError.prototype.__class__ = new Type('IOError', [Exception.prototype.__class__])
IOError.prototype.__class__.$pyclass = IOError

export function ImportError(msg) {
    Exception.call(this, 'ImportError', msg)
}
ImportError.prototype = Object.create(Exception.prototype)
ImportError.prototype.__class__ = new Type('ImportError', [Exception.prototype.__class__])
ImportError.prototype.__class__.$pyclass = ImportError

// ImportWarning = undefined

export function IndentationError(msg) {
    Exception.call(this, 'IndentationError', msg)
}
IndentationError.prototype = Object.create(Exception.prototype)
IndentationError.prototype.__class__ = new Type('IndentationError', [Exception.prototype.__class__])
IndentationError.prototype.__class__.$pyclass = IndentationError

export function IndexError(msg) {
    Exception.call(this, 'IndexError', msg)
}
IndexError.prototype = Object.create(Exception.prototype)
IndexError.prototype.__class__ = new Type('IndexError', [Exception.prototype.__class__])
IndexError.prototype.__class__.$pyclass = IndexError

export function KeyError(key) {
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
    Exception.call(this, 'KeyError', msg)
}
KeyError.prototype = Object.create(Exception.prototype)
KeyError.prototype.__class__ = new Type('KeyError', [Exception.prototype.__class__])
KeyError.prototype.__class__.$pyclass = KeyError

export function LookupError(msg) {
    Exception.call(this, 'LookupError', msg)
}
LookupError.prototype = Object.create(Exception.prototype)
LookupError.prototype.__class__ = new Type('LookupError', [Exception.prototype.__class__])
LookupError.prototype.__class__.$pyclass = LookupError

export function MemoryError(msg) {
    Exception.call(this, 'MemoryError', msg)
}
MemoryError.prototype = Object.create(Exception.prototype)
MemoryError.prototype.__class__ = new Type('MemoryError', [Exception.prototype.__class__])
MemoryError.prototype.__class__.$pyclass = MemoryError

export function NameError(msg) {
    Exception.call(this, 'NameError', msg)
}
NameError.prototype = Object.create(Exception.prototype)
NameError.prototype.__class__ = new Type('NameError', [Exception.prototype.__class__])
NameError.prototype.__class__.$pyclass = NameError

export function NotImplementedException(msg) {
    Exception.call(this, 'NotImplementedException', msg)
}
NotImplementedException.prototype = Object.create(Exception.prototype)
NotImplementedException.prototype.__class__ = new Type('NotImplementedException', [Exception.prototype.__class__])
NotImplementedException.prototype.__class__.$pyclass = NotImplementedException

export function NotImplementedError(msg) {
    Exception.call(this, 'NotImplementedError', msg)
}
NotImplementedError.prototype = Object.create(Exception.prototype)
NotImplementedError.prototype.__class__ = new Type('NotImplementedError', [Exception.prototype.__class__])
NotImplementedError.prototype.__class__.$pyclass = NotImplementedError

export function OSError(msg) {
    Exception.call(this, 'OSError', msg)
}
OSError.prototype = Object.create(Exception.prototype)
OSError.prototype.__class__ = new Type('OSError', [Exception.prototype.__class__])
OSError.prototype.__class__.$pyclass = OSError

export function OverflowError(msg) {
    Exception.call(this, 'OverflowError', msg)
}
OverflowError.prototype = Object.create(Exception.prototype)
OverflowError.prototype.__class__ = new Type('OverflowError', [Exception.prototype.__class__])
OverflowError.prototype.__class__.$pyclass = OverflowError

// PendingDeprecationWarning = undefined

export function PolyglotError(msg) {
    Exception.call(this, 'PolyglotError', msg)
}
PolyglotError.prototype = Object.create(Exception.prototype)
PolyglotError.prototype.__class__ = new Type('PolyglotError', [Exception.prototype.__class__])
PolyglotError.prototype.__class__.$pyclass = PolyglotError

export function ReferenceError(msg) {
    Exception.call(this, 'ReferenceError', msg)
}
ReferenceError.prototype = Object.create(Exception.prototype)
ReferenceError.prototype.__class__ = new Type('ReferenceError', [Exception.prototype.__class__])
ReferenceError.prototype.__class__.$pyclass = ReferenceError

export function RuntimeError(msg) {
    Exception.call(this, 'RuntimeError', msg)
}
RuntimeError.prototype = Object.create(Exception.prototype)
RuntimeError.prototype.__class__ = new Type('RuntimeError', [Exception.prototype.__class__])
RuntimeError.prototype.__class__.$pyclass = RuntimeError

// RuntimeWarning = undefined

export function StandardError(msg) {
    Exception.call(this, 'StandardError', msg)
}
StandardError.prototype = Object.create(Exception.prototype)
StandardError.prototype.__class__ = new Type('StandardError', [Exception.prototype.__class__])
StandardError.prototype.__class__.$pyclass = StandardError

export function StopIteration(msg) {
    Exception.call(this, 'StopIteration', msg)
}
StopIteration.prototype = Object.create(Exception.prototype)
StopIteration.prototype.__class__ = new Type('StopIteration', [Exception.prototype.__class__])
StopIteration.prototype.__class__.$pyclass = StopIteration

export function SyntaxError(msg) {
    Exception.call(this, 'SyntaxError', msg)
}
SyntaxError.prototype = Object.create(Exception.prototype)
SyntaxError.prototype.__class__ = new Type('SyntaxError', [Exception.prototype.__class__])
SyntaxError.prototype.__class__.$pyclass = SyntaxError

// SyntaxWarning = undefined

export function SystemError(msg) {
    Exception.call(this, 'SystemError', msg)
}
SystemError.prototype = Object.create(Exception.prototype)
SystemError.prototype.__class__ = new Type('SystemError', [Exception.prototype.__class__])
SystemError.prototype.__class__.$pyclass = SystemError

export function TabError(msg) {
    Exception.call(this, 'TabError', msg)
}
TabError.prototype = Object.create(Exception.prototype)
TabError.prototype.__class__ = new Type('TabError', [Exception.prototype.__class__])
TabError.prototype.__class__.$pyclass = TabError

export function TypeError(msg) {
    Exception.call(this, 'TypeError', msg)
}
TypeError.prototype = Object.create(Exception.prototype)
TypeError.prototype.__class__ = new Type('TypeError', [Exception.prototype.__class__])
TypeError.prototype.__class__.$pyclass = TypeError

export function UnboundLocalError(msg) {
    Exception.call(this, 'UnboundLocalError', msg)
}
UnboundLocalError.prototype = Object.create(Exception.prototype)
UnboundLocalError.prototype.__class__ = new Type('UnboundLocalError', [Exception.prototype.__class__])
UnboundLocalError.prototype.__class__.$pyclass = UnboundLocalError

export function UnicodeDecodeError(msg) {
    Exception.call(this, 'UnicodeDecodeError', msg)
}
UnicodeDecodeError.prototype = Object.create(Exception.prototype)
UnicodeDecodeError.prototype.__class__ = new Type('UnicodeDecodeError', [Exception.prototype.__class__])
UnicodeDecodeError.prototype.__class__.$pyclass = UnicodeDecodeError

export function UnicodeEncodeError(msg) {
    Exception.call(this, 'UnicodeEncodeError', msg)
}
UnicodeEncodeError.prototype = Object.create(Exception.prototype)
UnicodeEncodeError.prototype.__class__ = new Type('UnicodeEncodeError', [Exception.prototype.__class__])
UnicodeEncodeError.prototype.__class__.$pyclass = UnicodeEncodeError

export function UnicodeError(msg) {
    Exception.call(this, 'UnicodeError', msg)
}
UnicodeError.prototype = Object.create(Exception.prototype)
UnicodeError.prototype.__class__ = new Type('UnicodeError', [Exception.prototype.__class__])
UnicodeError.prototype.__class__.$pyclass = UnicodeError

export function UnicodeTranslateError(msg) {
    Exception.call(this, 'UnicodeTranslateError', msg)
}
UnicodeTranslateError.prototype = Object.create(Exception.prototype)
UnicodeTranslateError.prototype.__class__ = new Type('UnicodeTranslateError', [Exception.prototype.__class__])
UnicodeTranslateError.prototype.__class__.$pyclass = UnicodeTranslateError

// UnicodeWarning = undefined

// UserWarning = undefined

export function ValueError(msg) {
    Exception.call(this, 'ValueError', msg)
}
ValueError.prototype = Object.create(Exception.prototype)
ValueError.prototype.__class__ = new Type('ValueError', [Exception.prototype.__class__])
ValueError.prototype.__class__.$pyclass = ValueError

// Warning = undefined

export function ZeroDivisionError(msg) {
    Exception.call(this, 'ZeroDivisionError', msg)
}
ZeroDivisionError.prototype = Object.create(Exception.prototype)
ZeroDivisionError.prototype.__class__ = new Type('ZeroDivisionError', [Exception.prototype.__class__])
ZeroDivisionError.prototype.__class__.$pyclass = ZeroDivisionError
