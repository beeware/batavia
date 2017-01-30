var PyObject = require('./types/Object');
var Type = require('./types/Type').Type;
var types = require('../types');

var exceptions = {};

/*****************************************************************
 * Root exception
 *****************************************************************/
exceptions.BaseException = function(name, msg) {
    this.name = name;
    this.msg = msg;
}

exceptions.BaseException.__class__ = new Type('BaseException', [PyObject]);
exceptions.BaseException.prototype.__class__ = exceptions.BaseException.__class__;

exceptions.BaseException.prototype.toString = function() {
    return this.__str__();
}

exceptions.BaseException.prototype.__str__ = function() {
    if (this.msg) {
        return this.msg;
    } else {
        return '';
    }
}

exceptions.BaseException.prototype.__repr__ = function() {
    if (this.msg) {
        return this.name + "(" + this.msg + ")";
    } else {
        return this.name + "()";
    }
}

/*****************************************************************
 * Top level exceptions
 *****************************************************************/

exceptions.SystemExit = function (msg) {
    exceptions.BaseException.call(this, 'SystemExit', msg);
}
exceptions.SystemExit.prototype = Object.create(exceptions.BaseException.prototype);
exceptions.SystemExit.__class__ = new Type('SystemExit', [exceptions.BaseException]);
exceptions.SystemExit.prototype.__class__ = exceptions.SystemExit.__class__;

exceptions.KeyboardInterrupt = function (msg) {
    exceptions.BaseException.call(this, 'KeyboardInterrupt', msg);
}
exceptions.KeyboardInterrupt.prototype = Object.create(exceptions.BaseException.prototype);
exceptions.KeyboardInterrupt.__class__ = new Type('KeyboardInterrupt', [exceptions.BaseException]);
exceptions.KeyboardInterrupt.prototype.__class__ = exceptions.KeyboardInterrupt.__class__;

exceptions.GeneratorExit = function (msg) {
    exceptions.BaseException.call(this, 'GeneratorExit', msg);
}
exceptions.GeneratorExit.prototype = Object.create(exceptions.BaseException.prototype);
exceptions.GeneratorExit.__class__ = new Type('GeneratorExit', [exceptions.BaseException]);
exceptions.GeneratorExit.prototype.__class__ = exceptions.GeneratorExit.__class__;

exceptions.Exception = function (name, msg) {
    if (arguments.length == 1) {
        // If only one argument is provided, it will be the message.
        exceptions.BaseException.call(this, 'Exception', name);
    } else {
        exceptions.BaseException.call(this, name, msg);
    }
}
exceptions.Exception.prototype = Object.create(exceptions.BaseException.prototype);
exceptions.Exception.__class__ = new Type('Exception', [exceptions.BaseException]);
exceptions.Exception.prototype.__class__ = exceptions.Exception.__class__;

/*****************************************************************
 * All other exceptions
 *****************************************************************/

exceptions.BataviaError = function (msg) {
    exceptions.Exception.call(this, 'BataviaError', msg);
}
exceptions.BataviaError.prototype = Object.create(exceptions.Exception.prototype);
exceptions.BataviaError.__class__ = new Type('BataviaError', [exceptions.Exception]);
exceptions.BataviaError.prototype.__class__ = exceptions.BataviaError.__class__;

exceptions.ArithmeticError = function (msg) {
    exceptions.Exception.call(this, 'ArithmeticError', msg);
}
exceptions.ArithmeticError.prototype = Object.create(exceptions.Exception.prototype);
exceptions.ArithmeticError.__class__ = new Type('ArithmeticError', [exceptions.Exception]);
exceptions.ArithmeticError.prototype.__class__ = exceptions.ArithmeticError.__class__;

exceptions.AssertionError = function (msg) {
    exceptions.Exception.call(this, 'AssertionError', msg);
}
exceptions.AssertionError.prototype = Object.create(exceptions.Exception.prototype);
exceptions.AssertionError.__class__ = new Type('AssertionError', [exceptions.Exception]);
exceptions.AssertionError.prototype.__class__ = exceptions.AssertionError.__class__;

exceptions.AttributeError = function (msg) {
    exceptions.Exception.call(this, 'AttributeError', msg);
}
exceptions.AttributeError.prototype = Object.create(exceptions.Exception.prototype);
exceptions.AttributeError.__class__ = new Type('AttributeError', [exceptions.Exception]);
exceptions.AttributeError.prototype.__class__ = exceptions.AttributeError.__class__;

exceptions.BufferError = function (msg) {
    exceptions.Exception.call(this, 'BufferError', msg);
}
exceptions.BufferError.prototype = Object.create(exceptions.Exception.prototype);
exceptions.BufferError.__class__ = new Type('BufferError', [exceptions.Exception]);
exceptions.BufferError.prototype.__class__ = exceptions.BufferError.__class__;

exceptions.BytesWarning = undefined;

exceptions.DeprecationWarning = undefined;

exceptions.EOFError = function (msg) {
    exceptions.Exception.call(this, 'EOFError', msg);
}
exceptions.EOFError.prototype = Object.create(exceptions.Exception.prototype);
exceptions.EOFError.__class__ = new Type('EOFError', [exceptions.Exception]);
exceptions.EOFError.prototype.__class__ = exceptions.EOFError.__class__;

exceptions.EnvironmentError = function (msg) {
    exceptions.Exception.call(this, 'EnvironmentError', msg);
}
exceptions.EnvironmentError.prototype = Object.create(exceptions.Exception.prototype);
exceptions.EnvironmentError.__class__ = new Type('EnvironmentError', [exceptions.Exception]);
exceptions.EnvironmentError.prototype.__class__ = exceptions.EnvironmentError.__class__;

exceptions.FloatingPointError = function (msg) {
    exceptions.Exception.call(this, 'FloatingPointError', msg);
}
exceptions.FloatingPointError.prototype = Object.create(exceptions.Exception.prototype);
exceptions.FloatingPointError.__class__ = new Type('FloatingPointError', [exceptions.Exception]);
exceptions.FloatingPointError.prototype.__class__ = exceptions.FloatingPointError.__class__;

exceptions.FutureWarning = undefined;

exceptions.IOError = function (msg) {
    exceptions.Exception.call(this, 'IOError', msg);
}
exceptions.IOError.prototype = Object.create(exceptions.Exception.prototype);
exceptions.IOError.__class__ = new Type('IOError', [exceptions.Exception]);
exceptions.IOError.prototype.__class__ = exceptions.IOError.__class__;

exceptions.ImportError = function (msg) {
    exceptions.Exception.call(this, 'ImportError', msg);
}
exceptions.ImportError.prototype = Object.create(exceptions.Exception.prototype);
exceptions.ImportError.__class__ = new Type('ImportError', [exceptions.Exception]);
exceptions.ImportError.prototype.__class__ = exceptions.ImportError.__class__;

exceptions.ImportWarning = undefined;

exceptions.IndentationError = function (msg) {
    exceptions.Exception.call(this, 'IndentationError', msg);
}
exceptions.IndentationError.prototype = Object.create(exceptions.Exception.prototype);
exceptions.IndentationError.__class__ = new Type('IndentationError', [exceptions.Exception]);
exceptions.IndentationError.prototype.__class__ = exceptions.IndentationError.__class__;

exceptions.IndexError = function (msg) {
    exceptions.Exception.call(this, 'IndexError', msg);
}
exceptions.IndexError.prototype = Object.create(exceptions.Exception.prototype);
exceptions.IndexError.__class__ = new Type('IndexError', [exceptions.Exception]);
exceptions.IndexError.prototype.__class__ = exceptions.IndexError.__class__;

exceptions.KeyError = function (key) {
    var msg;
    if (key === null) {
        msg = "None";
    } else if (types.isinstance(key, types.Str)) {
        msg = key.__str__();
    } else if (key['__repr__'] && !key.hasOwnProperty('__repr__')) {
        msg = key.__repr__();
    } else {
        msg = key.toString();
    }
    exceptions.Exception.call(this, 'KeyError', msg);
}
exceptions.KeyError.prototype = Object.create(exceptions.Exception.prototype);
exceptions.KeyError.__class__ = new Type('KeyError', [exceptions.Exception], null, exceptions.KeyError);
exceptions.KeyError.prototype.__class__ = exceptions.KeyError.__class__;

exceptions.LookupError = function (msg) {
    exceptions.Exception.call(this, 'LookupError', msg);
}
exceptions.LookupError.prototype = Object.create(exceptions.Exception.prototype);
exceptions.LookupError.__class__ = new Type('LookupError', [exceptions.Exception]);
exceptions.LookupError.prototype.__class__ = exceptions.LookupError.__class__;

exceptions.MemoryError = function (msg) {
    exceptions.Exception.call(this, 'MemoryError', msg);
}
exceptions.MemoryError.prototype = Object.create(exceptions.Exception.prototype);
exceptions.MemoryError.__class__ = new Type('MemoryError', [exceptions.Exception]);
exceptions.MemoryError.prototype.__class__ = exceptions.MemoryError.__class__;

exceptions.NameError = function (msg) {
    exceptions.Exception.call(this, 'NameError', msg);
}
exceptions.NameError.prototype = Object.create(exceptions.Exception.prototype);
exceptions.NameError.__class__ = new Type('NameError', [exceptions.Exception]);
exceptions.NameError.prototype.__class__ = exceptions.NameError.__class__;

exceptions.NotImplementedException = function (msg) {
    exceptions.Exception.call(this, 'NotImplementedException', msg);
}
exceptions.NotImplementedException.prototype = Object.create(exceptions.Exception.prototype);
exceptions.NotImplementedException.__class__ = new Type('NotImplementedException', [exceptions.Exception]);
exceptions.NotImplementedException.prototype.__class__ = exceptions.NotImplementedException.__class__;

exceptions.NotImplementedError = function (msg) {
    exceptions.Exception.call(this, 'NotImplementedError', msg);
}
exceptions.NotImplementedError.prototype = Object.create(exceptions.Exception.prototype);
exceptions.NotImplementedError.__class__ = new Type('NotImplementedError', [exceptions.Exception]);
exceptions.NotImplementedError.prototype.__class__ = exceptions.NotImplementedError.__class__;

exceptions.OSError = function (msg) {
    exceptions.Exception.call(this, 'OSError', msg);
}
exceptions.OSError.prototype = Object.create(exceptions.Exception.prototype);
exceptions.OSError.__class__ = new Type('OSError', [exceptions.Exception]);
exceptions.OSError.prototype.__class__ = exceptions.OSError.__class__;

exceptions.OverflowError = function (msg) {
    exceptions.Exception.call(this, 'OverflowError', msg);
}
exceptions.OverflowError.prototype = Object.create(exceptions.Exception.prototype);
exceptions.OverflowError.__class__ = new Type('OverflowError', [exceptions.Exception]);
exceptions.OverflowError.prototype.__class__ = exceptions.OverflowError.__class__;

exceptions.PendingDeprecationWarning = undefined;

exceptions.PolyglotError = function (msg) {
    exceptions.Exception.call(this, 'PolyglotError', msg);
}
exceptions.PolyglotError.prototype = Object.create(exceptions.Exception.prototype);
exceptions.PolyglotError.__class__ = new Type('PolyglotError', [exceptions.Exception]);
exceptions.PolyglotError.prototype.__class__ = exceptions.PolyglotError.__class__;

exceptions.ReferenceError = function (msg) {
    exceptions.Exception.call(this, 'ReferenceError', msg);
}
exceptions.ReferenceError.prototype = Object.create(exceptions.Exception.prototype);
exceptions.ReferenceError.__class__ = new Type('ReferenceError', [exceptions.Exception]);
exceptions.ReferenceError.prototype.__class__ = exceptions.ReferenceError.__class__;

exceptions.RuntimeError = function (msg) {
    exceptions.Exception.call(this, 'RuntimeError', msg);
}
exceptions.RuntimeError.prototype = Object.create(exceptions.Exception.prototype);
exceptions.RuntimeError.__class__ = new Type('RuntimeError', [exceptions.Exception]);
exceptions.RuntimeError.prototype.__class__ = exceptions.RuntimeError.__class__;

exceptions.RuntimeWarning = undefined;

exceptions.StandardError = function (msg) {
    exceptions.Exception.call(this, 'StandardError', msg);
}
exceptions.StandardError.prototype = Object.create(exceptions.Exception.prototype);
exceptions.StandardError.__class__ = new Type('StandardError', [exceptions.Exception]);
exceptions.StandardError.prototype.__class__ = exceptions.StandardError.__class__;

exceptions.StopIteration = function (msg) {
    exceptions.Exception.call(this, 'StopIteration', msg);
}
exceptions.StopIteration.prototype = Object.create(exceptions.Exception.prototype);
exceptions.StopIteration.__class__ = new Type('StopIteration', [exceptions.Exception]);
exceptions.StopIteration.prototype.__class__ = exceptions.StopIteration.__class__;

exceptions.SyntaxError = function (msg) {
    exceptions.Exception.call(this, 'SyntaxError', msg);
}
exceptions.SyntaxError.prototype = Object.create(exceptions.Exception.prototype);
exceptions.SyntaxError.__class__ = new Type('SyntaxError', [exceptions.Exception]);
exceptions.SyntaxError.prototype.__class__ = exceptions.SyntaxError.__class__;

exceptions.SyntaxWarning = undefined;

exceptions.SystemError = function (msg) {
    exceptions.Exception.call(this, 'SystemError', msg);
}
exceptions.SystemError.prototype = Object.create(exceptions.Exception.prototype);
exceptions.SystemError.__class__ = new Type('SystemError', [exceptions.Exception]);
exceptions.SystemError.prototype.__class__ = exceptions.SystemError.__class__;

exceptions.TabError = function (msg) {
    exceptions.Exception.call(this, 'TabError', msg);
}
exceptions.TabError.prototype = Object.create(exceptions.Exception.prototype);
exceptions.TabError.__class__ = new Type('TabError', [exceptions.Exception]);
exceptions.TabError.prototype.__class__ = exceptions.TabError.__class__;

exceptions.TypeError = function (msg) {
    exceptions.Exception.call(this, 'TypeError', msg);
}
exceptions.TypeError.prototype = Object.create(exceptions.Exception.prototype);
exceptions.TypeError.__class__ = new Type('TypeError', [exceptions.Exception]);
exceptions.TypeError.prototype.__class__ = exceptions.TypeError.__class__;

exceptions.UnboundLocalError = function (msg) {
    exceptions.Exception.call(this, 'UnboundLocalError', msg);
}
exceptions.UnboundLocalError.prototype = Object.create(exceptions.Exception.prototype);
exceptions.UnboundLocalError.__class__ = new Type('UnboundLocalError', [exceptions.Exception]);
exceptions.UnboundLocalError.prototype.__class__ = exceptions.UnboundLocalError.__class__;

exceptions.UnicodeDecodeError = function (msg) {
    exceptions.Exception.call(this, 'UnicodeDecodeError', msg);
}
exceptions.UnicodeDecodeError.prototype = Object.create(exceptions.Exception.prototype);
exceptions.UnicodeDecodeError.__class__ = new Type('UnicodeDecodeError', [exceptions.Exception]);
exceptions.UnicodeDecodeError.prototype.__class__ = exceptions.UnicodeDecodeError.__class__;

exceptions.UnicodeEncodeError = function (msg) {
    exceptions.Exception.call(this, 'UnicodeEncodeError', msg);
}
exceptions.UnicodeEncodeError.prototype = Object.create(exceptions.Exception.prototype);
exceptions.UnicodeEncodeError.__class__ = new Type('UnicodeEncodeError', [exceptions.Exception]);
exceptions.UnicodeEncodeError.prototype.__class__ = exceptions.UnicodeEncodeError.__class__;

exceptions.UnicodeError = function (msg) {
    exceptions.Exception.call(this, 'UnicodeError', msg);
}
exceptions.UnicodeError.prototype = Object.create(exceptions.Exception.prototype);
exceptions.UnicodeError.__class__ = new Type('UnicodeError', [exceptions.Exception]);
exceptions.UnicodeError.prototype.__class__ = exceptions.UnicodeError.__class__;

exceptions.UnicodeTranslateError = function (msg) {
    exceptions.Exception.call(this, 'UnicodeTranslateError', msg);
}
exceptions.UnicodeTranslateError.prototype = Object.create(exceptions.Exception.prototype);
exceptions.UnicodeTranslateError.__class__ = new Type('UnicodeTranslateError', [exceptions.Exception]);
exceptions.UnicodeTranslateError.prototype.__class__ = exceptions.UnicodeTranslateError.__class__;

exceptions.UnicodeWarning = undefined;

exceptions.UserWarning = undefined;

exceptions.ValueError = function (msg) {
    exceptions.Exception.call(this, 'ValueError', msg);
}
exceptions.ValueError.prototype = Object.create(exceptions.Exception.prototype);
exceptions.ValueError.__class__ = new Type('ValueError', [exceptions.Exception]);
exceptions.ValueError.prototype.__class__ = exceptions.ValueError.__class__;

exceptions.Warning = undefined;

exceptions.ZeroDivisionError = function (msg) {
    exceptions.Exception.call(this, 'ZeroDivisionError', msg);
}
exceptions.ZeroDivisionError.prototype = Object.create(exceptions.Exception.prototype);
exceptions.ZeroDivisionError.__class__ = new Type('ZeroDivisionError', [exceptions.Exception]);
exceptions.ZeroDivisionError.prototype.__class__ = exceptions.ZeroDivisionError.__class__;

module.exports = exceptions;
