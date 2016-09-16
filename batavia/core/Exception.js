/*****************************************************************
 * Root exception
 *****************************************************************/

BaseException = function(name, msg) {
    this.name = name;
    this.msg = msg;
};

batavia.builtins.BaseException = BaseException;
batavia.builtins.BaseException.__class__ = new batavia.types.Type('BaseException', [batavia.types.Object], null, BaseException);
batavia.builtins.BaseException.prototype.__class__ = batavia.builtins.BaseException.__class__;

batavia.builtins.BaseException.prototype.toString = function() {
    return this.__str__();
};

batavia.builtins.BaseException.prototype.__str__ = function() {
    if (this.msg) {
        return this.msg;
    } else {
        return '';
    }
};

batavia.builtins.BaseException.prototype.__repr__ = function() {
    if (this.msg) {
        return this.name + "(" + this.msg + ")";
    } else {
        return this.name + "()";
    }
};

/*****************************************************************
 * Top level exceptions
 *****************************************************************/

function SystemExit(msg) {
    batavia.builtins.BaseException.call(this, 'SystemExit', msg);
}
batavia.builtins.SystemExit = SystemExit;
batavia.builtins.SystemExit.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.SystemExit.__class__ = new batavia.types.Type('SystemExit', [batavia.builtins.BaseException], null, SystemExit);
batavia.builtins.SystemExit.prototype.__class__ = batavia.builtins.SystemExit.__class__;

function KeyboardInterrupt(msg) {
    batavia.builtins.BaseException.call(this, 'KeyboardInterrupt', msg);
}
batavia.builtins.KeyboardInterrupt = KeyboardInterrupt;
batavia.builtins.KeyboardInterrupt.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.KeyboardInterrupt.__class__ = new batavia.types.Type('KeyboardInterrupt', [batavia.builtins.BaseException], null, KeyboardInterrupt);
batavia.builtins.KeyboardInterrupt.prototype.__class__ = batavia.builtins.KeyboardInterrupt.__class__;

function GeneratorExit(msg) {
    batavia.builtins.BaseException.call(this, 'GeneratorExit', msg);
}
batavia.builtins.GeneratorExit = GeneratorExit;
batavia.builtins.GeneratorExit.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.GeneratorExit.__class__ = new batavia.types.Type('GeneratorExit', [batavia.builtins.BaseException], null, GeneratorExit);
batavia.builtins.GeneratorExit.prototype.__class__ = batavia.builtins.GeneratorExit.__class__;

function Exception(name, msg) {
    if (arguments.length == 1) {
        // If only one argument is provided, it will be the message.
        batavia.builtins.BaseException.call(this, 'Exception', name);
    } else {
        batavia.builtins.BaseException.call(this, name, msg);
    }
}
batavia.builtins.Exception = Exception;
batavia.builtins.Exception.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.Exception.__class__ = new batavia.types.Type('Exception', [batavia.builtins.BaseException], null, Exception);
batavia.builtins.Exception.prototype.__class__ = batavia.builtins.Exception.__class__;

/*****************************************************************
 * All other exceptions
 *****************************************************************/

function BataviaError(msg) {
    batavia.builtins.Exception.call(this, 'BataviaError', msg);
}
batavia.builtins.BataviaError = BataviaError;
batavia.builtins.BataviaError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.BataviaError.__class__ = new batavia.types.Type('BataviaError', [batavia.builtins.Exception], null, BataviaError);
batavia.builtins.BataviaError.prototype.__class__ = batavia.builtins.BataviaError.__class__;

function ArithmeticError(msg) {
    batavia.builtins.Exception.call(this, 'ArithmeticError', msg);
}
batavia.builtins.ArithmeticError = ArithmeticError;
batavia.builtins.ArithmeticError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.ArithmeticError.__class__ = new batavia.types.Type('ArithmeticError', [batavia.builtins.Exception], null, ArithmeticError);
batavia.builtins.ArithmeticError.prototype.__class__ = batavia.builtins.ArithmeticError.__class__;

function AssertionError(msg) {
    batavia.builtins.Exception.call(this, 'AssertionError', msg);
}
batavia.builtins.AssertionError = AssertionError;
batavia.builtins.AssertionError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.AssertionError.__class__ = new batavia.types.Type('AssertionError', [batavia.builtins.Exception], null, AssertionError);
batavia.builtins.AssertionError.prototype.__class__ = batavia.builtins.AssertionError.__class__;

function AttributeError(msg) {
    batavia.builtins.Exception.call(this, 'AttributeError', msg);
}
batavia.builtins.AttributeError = AttributeError;
batavia.builtins.AttributeError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.AttributeError.__class__ = new batavia.types.Type('AttributeError', [batavia.builtins.Exception], null, AttributeError);
batavia.builtins.AttributeError.prototype.__class__ = batavia.builtins.AttributeError.__class__;

function BufferError(msg) {
    batavia.builtins.Exception.call(this, 'BufferError', msg);
}
batavia.builtins.BufferError = BufferError;
batavia.builtins.BufferError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.BufferError.__class__ = new batavia.types.Type('BufferError', [batavia.builtins.Exception], null, BufferError);
batavia.builtins.BufferError.prototype.__class__ = batavia.builtins.BufferError.__class__;

batavia.builtins.BytesWarning = undefined;

batavia.builtins.DeprecationWarning = undefined;

function EOFError(msg) {
    batavia.builtins.Exception.call(this, 'EOFError', msg);
}
batavia.builtins.EOFError = EOFError;
batavia.builtins.EOFError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.EOFError.__class__ = new batavia.types.Type('EOFError', [batavia.builtins.Exception], null, EOFError);
batavia.builtins.EOFError.prototype.__class__ = batavia.builtins.EOFError.__class__;

function EnvironmentError(msg) {
    batavia.builtins.Exception.call(this, 'EnvironmentError', msg);
}
batavia.builtins.EnvironmentError = EnvironmentError;
batavia.builtins.EnvironmentError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.EnvironmentError.__class__ = new batavia.types.Type('EnvironmentError', [batavia.builtins.Exception], null, EnvironmentError);
batavia.builtins.EnvironmentError.prototype.__class__ = batavia.builtins.EnvironmentError.__class__;

function FloatingPointError(msg) {
    batavia.builtins.Exception.call(this, 'FloatingPointError', msg);
}
batavia.builtins.FloatingPointError = FloatingPointError;
batavia.builtins.FloatingPointError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.FloatingPointError.__class__ = new batavia.types.Type('FloatingPointError', [batavia.builtins.Exception], null, FloatingPointError);
batavia.builtins.FloatingPointError.prototype.__class__ = batavia.builtins.FloatingPointError.__class__;

batavia.builtins.FutureWarning = undefined;

function IOError(msg) {
    batavia.builtins.Exception.call(this, 'IOError', msg);
}
batavia.builtins.IOError = IOError;
batavia.builtins.IOError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.IOError.__class__ = new batavia.types.Type('IOError', [batavia.builtins.Exception], null, IOError);
batavia.builtins.IOError.prototype.__class__ = batavia.builtins.IOError.__class__;

function ImportError(msg) {
    batavia.builtins.Exception.call(this, 'ImportError', msg);
}
batavia.builtins.ImportError = ImportError;
batavia.builtins.ImportError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.ImportError.__class__ = new batavia.types.Type('ImportError', [batavia.builtins.Exception], null, ImportError);
batavia.builtins.ImportError.prototype.__class__ = batavia.builtins.ImportError.__class__;

batavia.builtins.ImportWarning = undefined;

function IndentationError(msg) {
    batavia.builtins.Exception.call(this, 'IndentationError', msg);
}
batavia.builtins.IndentationError = IndentationError;
batavia.builtins.IndentationError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.IndentationError.__class__ = new batavia.types.Type('IndentationError', [batavia.builtins.Exception], null, IndentationError);
batavia.builtins.IndentationError.prototype.__class__ = batavia.builtins.IndentationError.__class__;

function IndexError(msg) {
    batavia.builtins.Exception.call(this, 'IndexError', msg);
}
batavia.builtins.IndexError = IndexError;
batavia.builtins.IndexError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.IndexError.__class__ = new batavia.types.Type('IndexError', [batavia.builtins.Exception], null, IndexError);
batavia.builtins.IndexError.prototype.__class__ = batavia.builtins.IndexError.__class__;

function KeyError(key) {
    var msg;
    if (key === null) {
        msg = "None";
    } else if (key['__repr__'] && !key.hasOwnProperty('__repr__')) {
        msg = key.__repr__();
    } else {
        msg = key.toString();
    }
    batavia.builtins.Exception.call(this, 'KeyError', msg);
}
batavia.builtins.KeyError = KeyError;
batavia.builtins.KeyError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.KeyError.__class__ = new batavia.types.Type('KeyError', [batavia.builtins.Exception], null, KeyError, null, KeyError);
batavia.builtins.KeyError.prototype.__class__ = batavia.builtins.KeyError.__class__;

function LookupError(msg) {
    batavia.builtins.Exception.call(this, 'LookupError', msg);
}
batavia.builtins.LookupError = LookupError;
batavia.builtins.LookupError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.LookupError.__class__ = new batavia.types.Type('LookupError', [batavia.builtins.Exception], null, LookupError);
batavia.builtins.LookupError.prototype.__class__ = batavia.builtins.LookupError.__class__;

function MemoryError(msg) {
    batavia.builtins.Exception.call(this, 'MemoryError', msg);
}
batavia.builtins.MemoryError = MemoryError;
batavia.builtins.MemoryError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.MemoryError.__class__ = new batavia.types.Type('MemoryError', [batavia.builtins.Exception], null, MemoryError);
batavia.builtins.MemoryError.prototype.__class__ = batavia.builtins.MemoryError.__class__;

function NameError(msg) {
    batavia.builtins.Exception.call(this, 'NameError', msg);
}
batavia.builtins.NameError = NameError;
batavia.builtins.NameError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.NameError.__class__ = new batavia.types.Type('NameError', [batavia.builtins.Exception], null, NameError);
batavia.builtins.NameError.prototype.__class__ = batavia.builtins.NameError.__class__;

function NotImplementedException(msg) {
    batavia.builtins.Exception.call(this, 'NotImplementedException', msg);
}
batavia.builtins.NotImplementedException = NotImplementedException;
batavia.builtins.NotImplementedException.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.NotImplementedException.__class__ = new batavia.types.Type('NotImplementedException', [batavia.builtins.Exception], null, NotImplementedException);
batavia.builtins.NotImplementedException.prototype.__class__ = batavia.builtins.NotImplementedException.__class__;

function NotImplementedError(msg) {
    batavia.builtins.Exception.call(this, 'NotImplementedError', msg);
}
batavia.builtins.NotImplementedError = NotImplementedError;
batavia.builtins.NotImplementedError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.NotImplementedError.__class__ = new batavia.types.Type('NotImplementedError', [batavia.builtins.Exception], null, NotImplementedError);
batavia.builtins.NotImplementedError.prototype.__class__ = batavia.builtins.NotImplementedError.__class__;

function OSError(msg) {
    batavia.builtins.Exception.call(this, 'OSError', msg);
}
batavia.builtins.OSError = OSError;
batavia.builtins.OSError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.OSError.__class__ = new batavia.types.Type('OSError', [batavia.builtins.Exception], null, OSError);
batavia.builtins.OSError.prototype.__class__ = batavia.builtins.OSError.__class__;

function OverflowError(msg) {
    batavia.builtins.Exception.call(this, 'OverflowError', msg);
}
batavia.builtins.OverflowError = OverflowError;
batavia.builtins.OverflowError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.OverflowError.__class__ = new batavia.types.Type('OverflowError', [batavia.builtins.Exception], null, OverflowError);
batavia.builtins.OverflowError.prototype.__class__ = batavia.builtins.OverflowError.__class__;

batavia.builtins.PendingDeprecationWarning = undefined;

function PolyglotError(msg) {
    batavia.builtins.Exception.call(this, 'PolyglotError', msg);
}
batavia.builtins.PolyglotError = PolyglotError;
batavia.builtins.PolyglotError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.PolyglotError.__class__ = new batavia.types.Type('PolyglotError', [batavia.builtins.Exception], null, PolyglotError);
batavia.builtins.PolyglotError.prototype.__class__ = batavia.builtins.PolyglotError.__class__;

function ReferenceError(msg) {
    batavia.builtins.Exception.call(this, 'ReferenceError', msg);
}
batavia.builtins.ReferenceError = ReferenceError;
batavia.builtins.ReferenceError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.ReferenceError.__class__ = new batavia.types.Type('ReferenceError', [batavia.builtins.Exception], null, ReferenceError);
batavia.builtins.ReferenceError.prototype.__class__ = batavia.builtins.ReferenceError.__class__;

function RuntimeError(msg) {
    batavia.builtins.Exception.call(this, 'RuntimeError', msg);
}
batavia.builtins.RuntimeError = RuntimeError;
batavia.builtins.RuntimeError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.RuntimeError.__class__ = new batavia.types.Type('RuntimeError', [batavia.builtins.Exception], null, RuntimeError);
batavia.builtins.RuntimeError.prototype.__class__ = batavia.builtins.RuntimeError.__class__;

batavia.builtins.RuntimeWarning = undefined;

function StandardError(msg) {
    batavia.builtins.Exception.call(this, 'StandardError', msg);
}
batavia.builtins.StandardError = StandardError;
batavia.builtins.StandardError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.StandardError.__class__ = new batavia.types.Type('StandardError', [batavia.builtins.Exception], null, StandardError);
batavia.builtins.StandardError.prototype.__class__ = batavia.builtins.StandardError.__class__;

function StopIteration(msg) {
    batavia.builtins.Exception.call(this, 'StopIteration', msg);
}
batavia.builtins.StopIteration = StopIteration;
batavia.builtins.StopIteration.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.StopIteration.__class__ = new batavia.types.Type('StopIteration', [batavia.builtins.Exception], null, StopIteration);
batavia.builtins.StopIteration.prototype.__class__ = batavia.builtins.StopIteration.__class__;

function SyntaxError(msg) {
    batavia.builtins.Exception.call(this, 'SyntaxError', msg);
}
batavia.builtins.SyntaxError = SyntaxError;
batavia.builtins.SyntaxError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.SyntaxError.__class__ = new batavia.types.Type('SyntaxError', [batavia.builtins.Exception], null, SyntaxError);
batavia.builtins.SyntaxError.prototype.__class__ = batavia.builtins.SyntaxError.__class__;

batavia.builtins.SyntaxWarning = undefined;

function SystemError(msg) {
    batavia.builtins.Exception.call(this, 'SystemError', msg);
}
batavia.builtins.SystemError = SystemError;
batavia.builtins.SystemError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.SystemError.__class__ = new batavia.types.Type('SystemError', [batavia.builtins.Exception], null, SystemError);
batavia.builtins.SystemError.prototype.__class__ = batavia.builtins.SystemError.__class__;

function TabError(msg) {
    batavia.builtins.Exception.call(this, 'TabError', msg);
}
batavia.builtins.TabError = TabError;
batavia.builtins.TabError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.TabError.__class__ = new batavia.types.Type('TabError', [batavia.builtins.Exception], null, TabError);
batavia.builtins.TabError.prototype.__class__ = batavia.builtins.TabError.__class__;

function TypeError(msg) {
    batavia.builtins.Exception.call(this, 'TypeError', msg);
}
batavia.builtins.TypeError = TypeError;
batavia.builtins.TypeError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.TypeError.__class__ = new batavia.types.Type('TypeError', [batavia.builtins.Exception], null, TypeError);
batavia.builtins.TypeError.prototype.__class__ = batavia.builtins.TypeError.__class__;

function UnboundLocalError(msg) {
    batavia.builtins.Exception.call(this, 'UnboundLocalError', msg);
}
batavia.builtins.UnboundLocalError = UnboundLocalError;
batavia.builtins.UnboundLocalError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.UnboundLocalError.__class__ = new batavia.types.Type('UnboundLocalError', [batavia.builtins.Exception], null, UnboundLocalError);
batavia.builtins.UnboundLocalError.prototype.__class__ = batavia.builtins.UnboundLocalError.__class__;

function UnicodeDecodeError(msg) {
    batavia.builtins.Exception.call(this, 'UnicodeDecodeError', msg);
}
batavia.builtins.UnicodeDecodeError = UnicodeDecodeError;
batavia.builtins.UnicodeDecodeError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.UnicodeDecodeError.__class__ = new batavia.types.Type('UnicodeDecodeError', [batavia.builtins.Exception], null, UnicodeDecodeError);
batavia.builtins.UnicodeDecodeError.prototype.__class__ = batavia.builtins.UnicodeDecodeError.__class__;

function UnicodeEncodeError(msg) {
    batavia.builtins.Exception.call(this, 'UnicodeEncodeError', msg);
}
batavia.builtins.UnicodeEncodeError = UnicodeEncodeError;
batavia.builtins.UnicodeEncodeError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.UnicodeEncodeError.__class__ = new batavia.types.Type('UnicodeEncodeError', [batavia.builtins.Exception], null, UnicodeEncodeError);
batavia.builtins.UnicodeEncodeError.prototype.__class__ = batavia.builtins.UnicodeEncodeError.__class__;

function UnicodeError(msg) {
    batavia.builtins.Exception.call(this, 'UnicodeError', msg);
}
batavia.builtins.UnicodeError = UnicodeError;
batavia.builtins.UnicodeError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.UnicodeError.__class__ = new batavia.types.Type('UnicodeError', [batavia.builtins.Exception], null, UnicodeError);
batavia.builtins.UnicodeError.prototype.__class__ = batavia.builtins.UnicodeError.__class__;

function UnicodeTranslateError(msg) {
    batavia.builtins.Exception.call(this, 'UnicodeTranslateError', msg);
}
batavia.builtins.UnicodeTranslateError = UnicodeTranslateError;
batavia.builtins.UnicodeTranslateError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.UnicodeTranslateError.__class__ = new batavia.types.Type('UnicodeTranslateError', [batavia.builtins.Exception], null, UnicodeTranslateError);
batavia.builtins.UnicodeTranslateError.prototype.__class__ = batavia.builtins.UnicodeTranslateError.__class__;

batavia.builtins.UnicodeWarning = undefined;

batavia.builtins.UserWarning = undefined;

function ValueError(msg) {
    batavia.builtins.Exception.call(this, 'ValueError', msg);
}
batavia.builtins.ValueError = ValueError;
batavia.builtins.ValueError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.ValueError.__class__ = new batavia.types.Type('ValueError', [batavia.builtins.Exception], null, ValueError);
batavia.builtins.ValueError.prototype.__class__ = batavia.builtins.ValueError.__class__;

batavia.builtins.Warning = undefined;

function ZeroDivisionError(msg) {
    batavia.builtins.Exception.call(this, 'ZeroDivisionError', msg);
}
batavia.builtins.ZeroDivisionError = ZeroDivisionError;
batavia.builtins.ZeroDivisionError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.ZeroDivisionError.__class__ = new batavia.types.Type('ZeroDivisionError', [batavia.builtins.Exception], null, ZeroDivisionError);
batavia.builtins.ZeroDivisionError.prototype.__class__ = batavia.builtins.ZeroDivisionError.__class__;
