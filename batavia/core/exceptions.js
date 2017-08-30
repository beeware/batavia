/* eslint-disable no-extend-native */
var PyObject = require('./types/Object')
var Type = require('./types/Type').Type

var exceptions = {}

/*****************************************************************
 * Root exception
 *****************************************************************/
var BaseException = function(name, msg) {
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

exceptions.BaseException = BaseException.prototype.__class__

/*****************************************************************
 * Top level exceptions
 *****************************************************************/

var SystemExit = function(msg) {
    BaseException.call(this, 'SystemExit', msg)
}
SystemExit.prototype = Object.create(BaseException.prototype)
SystemExit.prototype.__class__ = new Type('SystemExit', [BaseException.prototype.__class__])
SystemExit.prototype.__class__.$pyclass = SystemExit

exceptions.SystemExit = SystemExit.prototype.__class__

var KeyboardInterrupt = function(msg) {
    BaseException.call(this, 'KeyboardInterrupt', msg)
}
KeyboardInterrupt.prototype = Object.create(BaseException.prototype)
KeyboardInterrupt.prototype.__class__ = new Type('KeyboardInterrupt', [BaseException.prototype.__class__])
KeyboardInterrupt.prototype.__class__.$pyclass = KeyboardInterrupt

exceptions.KeyboardInterrupt = KeyboardInterrupt.prototype.__class__

var GeneratorExit = function(msg) {
    BaseException.call(this, 'GeneratorExit', msg)
}
GeneratorExit.prototype = Object.create(BaseException.prototype)
GeneratorExit.prototype.__class__ = new Type('GeneratorExit', [BaseException.prototype.__class__])
GeneratorExit.prototype.__class__.$pyclass = GeneratorExit

exceptions.GeneratorExit = GeneratorExit.prototype.__class__

var Exception = function(name, msg) {
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

exceptions.Exception = Exception.prototype.__class__

/*****************************************************************
 * All other exceptions
 *****************************************************************/

var BataviaError = function(msg) {
    Exception.call(this, 'BataviaError', msg)
}
BataviaError.prototype = Object.create(Exception.prototype)
BataviaError.prototype.__class__ = new Type('BataviaError', [Exception.prototype.__class__])
BataviaError.prototype.__class__.$pyclass = BataviaError

exceptions.BataviaError = BataviaError.prototype.__class__

var ArithmeticError = function(msg) {
    Exception.call(this, 'ArithmeticError', msg)
}
ArithmeticError.prototype = Object.create(Exception.prototype)
ArithmeticError.prototype.__class__ = new Type('ArithmeticError', [Exception.prototype.__class__])
ArithmeticError.prototype.__class__.$pyclass = ArithmeticError

exceptions.ArithmeticError = ArithmeticError.prototype.__class__

var AssertionError = function(msg) {
    Exception.call(this, 'AssertionError', msg)
}
AssertionError.prototype = Object.create(Exception.prototype)
AssertionError.prototype.__class__ = new Type('AssertionError', [Exception.prototype.__class__])
AssertionError.prototype.__class__.$pyclass = AssertionError

exceptions.AssertionError = AssertionError.prototype.__class__

var AttributeError = function(msg) {
    Exception.call(this, 'AttributeError', msg)
}
AttributeError.prototype = Object.create(Exception.prototype)
AttributeError.prototype.__class__ = new Type('AttributeError', [Exception.prototype.__class__])
AttributeError.prototype.__class__.$pyclass = AttributeError

exceptions.AttributeError = AttributeError.prototype.__class__

var BufferError = function(msg) {
    Exception.call(this, 'BufferError', msg)
}
BufferError.prototype = Object.create(Exception.prototype)
BufferError.prototype.__class__ = new Type('BufferError', [Exception.prototype.__class__])
BufferError.prototype.__class__.$pyclass = BufferError

exceptions.BufferError = BufferError.prototype.__class__

exceptions.BytesWarning = undefined

exceptions.DeprecationWarning = undefined

var EOFError = function(msg) {
    Exception.call(this, 'EOFError', msg)
}
EOFError.prototype = Object.create(Exception.prototype)
EOFError.prototype.__class__ = new Type('EOFError', [Exception.prototype.__class__])
EOFError.prototype.__class__.$pyclass = EOFError

exceptions.EOFError = EOFError.prototype.__class__

var EnvironmentError = function(msg) {
    Exception.call(this, 'EnvironmentError', msg)
}
EnvironmentError.prototype = Object.create(Exception.prototype)
EnvironmentError.prototype.__class__ = new Type('EnvironmentError', [Exception.prototype.__class__])
EnvironmentError.prototype.__class__.$pyclass = EnvironmentError

exceptions.EnvironmentError = EnvironmentError.prototype.__class__

var FloatingPointError = function(msg) {
    Exception.call(this, 'FloatingPointError', msg)
}
FloatingPointError.prototype = Object.create(Exception.prototype)
FloatingPointError.prototype.__class__ = new Type('FloatingPointError', [Exception.prototype.__class__])
FloatingPointError.prototype.__class__.$pyclass = FloatingPointError

exceptions.FloatingPointError = FloatingPointError.prototype.__class__

exceptions.FutureWarning = undefined

var IOError = function(msg) {
    Exception.call(this, 'IOError', msg)
}
IOError.prototype = Object.create(Exception.prototype)
IOError.prototype.__class__ = new Type('IOError', [Exception.prototype.__class__])
IOError.prototype.__class__.$pyclass = IOError

exceptions.IOError = IOError.prototype.__class__

var ImportError = function(msg) {
    Exception.call(this, 'ImportError', msg)
}
ImportError.prototype = Object.create(Exception.prototype)
ImportError.prototype.__class__ = new Type('ImportError', [Exception.prototype.__class__])
ImportError.prototype.__class__.$pyclass = ImportError

exceptions.ImportError = ImportError.prototype.__class__

exceptions.ImportWarning = undefined

var IndentationError = function(msg) {
    Exception.call(this, 'IndentationError', msg)
}
IndentationError.prototype = Object.create(Exception.prototype)
IndentationError.prototype.__class__ = new Type('IndentationError', [Exception.prototype.__class__])
IndentationError.prototype.__class__.$pyclass = IndentationError

exceptions.IndentationError = IndentationError.prototype.__class__

var IndexError = function(msg) {
    Exception.call(this, 'IndexError', msg)
}
IndexError.prototype = Object.create(Exception.prototype)
IndexError.prototype.__class__ = new Type('IndexError', [Exception.prototype.__class__])
IndexError.prototype.__class__.$pyclass = IndexError

exceptions.IndexError = IndexError.prototype.__class__

var KeyError = function(key) {
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

exceptions.KeyError = KeyError.prototype.__class__

var LookupError = function(msg) {
    Exception.call(this, 'LookupError', msg)
}
LookupError.prototype = Object.create(Exception.prototype)
LookupError.prototype.__class__ = new Type('LookupError', [Exception.prototype.__class__])
LookupError.prototype.__class__.$pyclass = LookupError

exceptions.LookupError = LookupError.prototype.__class__

var MemoryError = function(msg) {
    Exception.call(this, 'MemoryError', msg)
}
MemoryError.prototype = Object.create(Exception.prototype)
MemoryError.prototype.__class__ = new Type('MemoryError', [Exception.prototype.__class__])
MemoryError.prototype.__class__.$pyclass = MemoryError

exceptions.MemoryError = MemoryError.prototype.__class__

var NameError = function(msg) {
    Exception.call(this, 'NameError', msg)
}
NameError.prototype = Object.create(Exception.prototype)
NameError.prototype.__class__ = new Type('NameError', [Exception.prototype.__class__])
NameError.prototype.__class__.$pyclass = NameError

exceptions.NameError = NameError.prototype.__class__

var NotImplementedException = function(msg) {
    Exception.call(this, 'NotImplementedException', msg)
}
NotImplementedException.prototype = Object.create(Exception.prototype)
NotImplementedException.prototype.__class__ = new Type('NotImplementedException', [Exception.prototype.__class__])
NotImplementedException.prototype.__class__.$pyclass = NotImplementedException

exceptions.NotImplementedException = NotImplementedException.prototype.__class__

var NotImplementedError = function(msg) {
    Exception.call(this, 'NotImplementedError', msg)
}
NotImplementedError.prototype = Object.create(Exception.prototype)
NotImplementedError.prototype.__class__ = new Type('NotImplementedError', [Exception.prototype.__class__])
NotImplementedError.prototype.__class__.$pyclass = NotImplementedError

exceptions.NotImplementedError = NotImplementedError.prototype.__class__

var OSError = function(msg) {
    Exception.call(this, 'OSError', msg)
}
OSError.prototype = Object.create(Exception.prototype)
OSError.prototype.__class__ = new Type('OSError', [Exception.prototype.__class__])
OSError.prototype.__class__.$pyclass = OSError

exceptions.OSError = OSError.prototype.__class__

var OverflowError = function(msg) {
    Exception.call(this, 'OverflowError', msg)
}
OverflowError.prototype = Object.create(Exception.prototype)
OverflowError.prototype.__class__ = new Type('OverflowError', [Exception.prototype.__class__])
OverflowError.prototype.__class__.$pyclass = OverflowError
exceptions.OverflowError = OverflowError.prototype.__class__

exceptions.PendingDeprecationWarning = undefined

var PolyglotError = function(msg) {
    Exception.call(this, 'PolyglotError', msg)
}
PolyglotError.prototype = Object.create(Exception.prototype)
PolyglotError.prototype.__class__ = new Type('PolyglotError', [Exception.prototype.__class__])
PolyglotError.prototype.__class__.$pyclass = PolyglotError

exceptions.PolyglotError = PolyglotError.prototype.__class__

var ReferenceError = function(msg) {
    Exception.call(this, 'ReferenceError', msg)
}
ReferenceError.prototype = Object.create(Exception.prototype)
ReferenceError.prototype.__class__ = new Type('ReferenceError', [Exception.prototype.__class__])
ReferenceError.prototype.__class__.$pyclass = ReferenceError

exceptions.ReferenceError = ReferenceError.prototype.__class__

var RuntimeError = function(msg) {
    Exception.call(this, 'RuntimeError', msg)
}
RuntimeError.prototype = Object.create(Exception.prototype)
RuntimeError.prototype.__class__ = new Type('RuntimeError', [Exception.prototype.__class__])
RuntimeError.prototype.__class__.$pyclass = RuntimeError

exceptions.RuntimeError = RuntimeError.prototype.__class__

exceptions.RuntimeWarning = undefined

var StandardError = function(msg) {
    Exception.call(this, 'StandardError', msg)
}
StandardError.prototype = Object.create(Exception.prototype)
StandardError.prototype.__class__ = new Type('StandardError', [Exception.prototype.__class__])
StandardError.prototype.__class__.$pyclass = StandardError

exceptions.StandardError = StandardError.prototype.__class__

var StopIteration = function(msg) {
    Exception.call(this, 'StopIteration', msg)
}
StopIteration.prototype = Object.create(Exception.prototype)
StopIteration.prototype.__class__ = new Type('StopIteration', [Exception.prototype.__class__])
StopIteration.prototype.__class__.$pyclass = StopIteration

exceptions.StopIteration = StopIteration.prototype.__class__

var SyntaxError = function(msg) {
    Exception.call(this, 'SyntaxError', msg)
}
SyntaxError.prototype = Object.create(Exception.prototype)
SyntaxError.prototype.__class__ = new Type('SyntaxError', [Exception.prototype.__class__])
SyntaxError.prototype.__class__.$pyclass = SyntaxError

exceptions.SyntaxError = SyntaxError.prototype.__class__

exceptions.SyntaxWarning = undefined

var SystemError = function(msg) {
    Exception.call(this, 'SystemError', msg)
}
SystemError.prototype = Object.create(Exception.prototype)
SystemError.prototype.__class__ = new Type('SystemError', [Exception.prototype.__class__])
SystemError.prototype.__class__.$pyclass = SystemError

exceptions.SystemError = SystemError.prototype.__class__

var TabError = function(msg) {
    Exception.call(this, 'TabError', msg)
}
TabError.prototype = Object.create(Exception.prototype)
TabError.prototype.__class__ = new Type('TabError', [Exception.prototype.__class__])
TabError.prototype.__class__.$pyclass = TabError

exceptions.TabError = TabError.prototype.__class__

var TypeError = function(msg) {
    Exception.call(this, 'TypeError', msg)
}
TypeError.prototype = Object.create(Exception.prototype)
TypeError.prototype.__class__ = new Type('TypeError', [Exception.prototype.__class__])
TypeError.prototype.__class__.$pyclass = TypeError

exceptions.TypeError = TypeError.prototype.__class__

var UnboundLocalError = function(msg) {
    Exception.call(this, 'UnboundLocalError', msg)
}
UnboundLocalError.prototype = Object.create(Exception.prototype)
UnboundLocalError.prototype.__class__ = new Type('UnboundLocalError', [Exception.prototype.__class__])
UnboundLocalError.prototype.__class__.$pyclass = UnboundLocalError

exceptions.UnboundLocalError = UnboundLocalError.prototype.__class__

var UnicodeDecodeError = function(msg) {
    Exception.call(this, 'UnicodeDecodeError', msg)
}
UnicodeDecodeError.prototype = Object.create(Exception.prototype)
UnicodeDecodeError.prototype.__class__ = new Type('UnicodeDecodeError', [Exception.prototype.__class__])
UnicodeDecodeError.prototype.__class__.$pyclass = UnicodeDecodeError

exceptions.UnicodeDecodeError = UnicodeDecodeError.prototype.__class__

var UnicodeEncodeError = function(msg) {
    Exception.call(this, 'UnicodeEncodeError', msg)
}
UnicodeEncodeError.prototype = Object.create(Exception.prototype)
UnicodeEncodeError.prototype.__class__ = new Type('UnicodeEncodeError', [Exception.prototype.__class__])
UnicodeEncodeError.prototype.__class__.$pyclass = UnicodeEncodeError

exceptions.UnicodeEncodeError = UnicodeEncodeError.prototype.__class__

var UnicodeError = function(msg) {
    Exception.call(this, 'UnicodeError', msg)
}
UnicodeError.prototype = Object.create(Exception.prototype)
UnicodeError.prototype.__class__ = new Type('UnicodeError', [Exception.prototype.__class__])
UnicodeError.prototype.__class__.$pyclass = UnicodeError

exceptions.UnicodeError = UnicodeError.prototype.__class__

var UnicodeTranslateError = function(msg) {
    Exception.call(this, 'UnicodeTranslateError', msg)
}
UnicodeTranslateError.prototype = Object.create(Exception.prototype)
UnicodeTranslateError.prototype.__class__ = new Type('UnicodeTranslateError', [Exception.prototype.__class__])
UnicodeTranslateError.prototype.__class__.$pyclass = UnicodeTranslateError

exceptions.UnicodeTranslateError = UnicodeTranslateError.prototype.__class__

exceptions.UnicodeWarning = undefined

exceptions.UserWarning = undefined

var ValueError = function(msg) {
    Exception.call(this, 'ValueError', msg)
}
ValueError.prototype = Object.create(Exception.prototype)
ValueError.prototype.__class__ = new Type('ValueError', [Exception.prototype.__class__])
ValueError.prototype.__class__.$pyclass = ValueError

exceptions.ValueError = ValueError.prototype.__class__

exceptions.Warning = undefined

var ZeroDivisionError = function(msg) {
    Exception.call(this, 'ZeroDivisionError', msg)
}
ZeroDivisionError.prototype = Object.create(Exception.prototype)
ZeroDivisionError.prototype.__class__ = new Type('ZeroDivisionError', [Exception.prototype.__class__])
ZeroDivisionError.prototype.__class__.$pyclass = ZeroDivisionError

exceptions.ZeroDivisionError = ZeroDivisionError.prototype.__class__

var JSONDecodeError = function(msg) {
    Exception.call(this, 'JSONDecodeError', msg)
}
JSONDecodeError.prototype = Object.create(Exception.prototype)
JSONDecodeError.prototype.__class__ = new Type('JSONDecodeError', [Exception.prototype.__class__])
JSONDecodeError.prototype.__class__.$pyclass = JSONDecodeError

exceptions.JSONDecodeError = JSONDecodeError.prototype.__class__

module.exports = exceptions
