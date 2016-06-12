/*****************************************************************
 * Root exception
 *****************************************************************/

BaseException = function(name, msg) {
    this.name = name;
    this.msg = msg;
};

batavia.builtins.BaseException = BaseException;
batavia.builtins.BaseException.prototype.__class__ = new batavia.types.Type('BaseException', [batavia.types.Object]);

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
batavia.builtins.SystemExit.prototype.__class__ = new batavia.types.Type('SystemExit', [batavia.builtins.BaseException]);

function KeyboardInterrupt(msg) {
    batavia.builtins.BaseException.call(this, 'KeyboardInterrupt', msg);
}
batavia.builtins.KeyboardInterrupt = KeyboardInterrupt;
batavia.builtins.KeyboardInterrupt.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.KeyboardInterrupt.prototype.__class__ = new batavia.types.Type('KeyboardInterrupt', [batavia.builtins.BaseException]);

function GeneratorExit(msg) {
    batavia.builtins.BaseException.call(this, 'GeneratorExit', msg);
}
batavia.builtins.GeneratorExit = GeneratorExit;
batavia.builtins.GeneratorExit.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.GeneratorExit.prototype.__class__ = new batavia.types.Type('GeneratorExit', [batavia.builtins.BaseException]);

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
batavia.builtins.Exception.prototype.__class__ = new batavia.types.Type('Exception', [batavia.builtins.BaseException]);

/*****************************************************************
 * All other exceptions
 *****************************************************************/

function BataviaError(msg) {
    batavia.builtins.Exception.call(this, 'BataviaError', msg);
}
batavia.builtins.BataviaError = BataviaError;
batavia.builtins.BataviaError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.BataviaError.prototype.__class__ = new batavia.types.Type('BataviaError', [batavia.builtins.Exception]);

function ArithmeticError(msg) {
    batavia.builtins.Exception.call(this, 'ArithmeticError', msg);
}
batavia.builtins.ArithmeticError = ArithmeticError;
batavia.builtins.ArithmeticError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.ArithmeticError.prototype.__class__ = new batavia.types.Type('ArithmeticError', [batavia.builtins.Exception]);

function AssertionError(msg) {
    batavia.builtins.Exception.call(this, 'AssertionError', msg);
}
batavia.builtins.AssertionError = AssertionError;
batavia.builtins.AssertionError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.AssertionError.prototype.__class__ = new batavia.types.Type('AssertionError', [batavia.builtins.Exception]);

function AttributeError(msg) {
    batavia.builtins.Exception.call(this, 'AttributeError', msg);
}
batavia.builtins.AttributeError = AttributeError;
batavia.builtins.AttributeError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.AttributeError.prototype.__class__ = new batavia.types.Type('AttributeError', [batavia.builtins.Exception]);

function BufferError(msg) {
    batavia.builtins.Exception.call(this, 'BufferError', msg);
}
batavia.builtins.BufferError = BufferError;
batavia.builtins.BufferError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.BufferError.prototype.__class__ = new batavia.types.Type('BufferError', [batavia.builtins.Exception]);

batavia.builtins.BytesWarning = undefined;

batavia.builtins.DeprecationWarning = undefined;

function EOFError(msg) {
    batavia.builtins.Exception.call(this, 'EOFError', msg);
}
batavia.builtins.EOFError = EOFError;
batavia.builtins.EOFError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.EOFError.prototype.__class__ = new batavia.types.Type('EOFError', [batavia.builtins.Exception]);

function EnvironmentError(msg) {
    batavia.builtins.Exception.call(this, 'EnvironmentError', msg);
}
batavia.builtins.EnvironmentError = EnvironmentError;
batavia.builtins.EnvironmentError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.EnvironmentError.prototype.__class__ = new batavia.types.Type('EnvironmentError', [batavia.builtins.Exception]);

function FloatingPointError(msg) {
    batavia.builtins.Exception.call(this, 'FloatingPointError', msg);
}
batavia.builtins.FloatingPointError = FloatingPointError;
batavia.builtins.FloatingPointError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.FloatingPointError.prototype.__class__ = new batavia.types.Type('FloatingPointError', [batavia.builtins.Exception]);

batavia.builtins.FutureWarning = undefined;

function IOError(msg) {
    batavia.builtins.Exception.call(this, 'IOError', msg);
}
batavia.builtins.IOError = IOError;
batavia.builtins.IOError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.IOError.prototype.__class__ = new batavia.types.Type('IOError', [batavia.builtins.Exception]);

function ImportError(msg) {
    batavia.builtins.Exception.call(this, 'ImportError', msg);
}
batavia.builtins.ImportError = ImportError;
batavia.builtins.ImportError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.ImportError.prototype.__class__ = new batavia.types.Type('ImportError', [batavia.builtins.Exception]);

batavia.builtins.ImportWarning = undefined;

function IndentationError(msg) {
    batavia.builtins.Exception.call(this, 'IndentationError', msg);
}
batavia.builtins.IndentationError = IndentationError;
batavia.builtins.IndentationError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.IndentationError.prototype.__class__ = new batavia.types.Type('IndentationError', [batavia.builtins.Exception]);

function IndexError(msg) {
    batavia.builtins.Exception.call(this, 'IndexError', msg);
}
batavia.builtins.IndexError = IndexError;
batavia.builtins.IndexError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.IndexError.prototype.__class__ = new batavia.types.Type('IndexError', [batavia.builtins.Exception]);

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
batavia.builtins.KeyError.prototype.__class__ = new batavia.types.Type('KeyError', [batavia.builtins.Exception]);

function LookupError(msg) {
    batavia.builtins.Exception.call(this, 'LookupError', msg);
}
batavia.builtins.LookupError = LookupError;
batavia.builtins.LookupError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.LookupError.prototype.__class__ = new batavia.types.Type('LookupError', [batavia.builtins.Exception]);

function MemoryError(msg) {
    batavia.builtins.Exception.call(this, 'MemoryError', msg);
}
batavia.builtins.MemoryError = MemoryError;
batavia.builtins.MemoryError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.MemoryError.prototype.__class__ = new batavia.types.Type('MemoryError', [batavia.builtins.Exception]);

function NameError(msg) {
    batavia.builtins.Exception.call(this, 'NameError', msg);
}
batavia.builtins.NameError = NameError;
batavia.builtins.NameError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.NameError.prototype.__class__ = new batavia.types.Type('NameError', [batavia.builtins.Exception]);

function NotImplementedException(msg) {
    batavia.builtins.Exception.call(this, 'NotImplementedException', msg);
}
batavia.builtins.NotImplementedException = NotImplementedException;
batavia.builtins.NotImplementedException.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.NotImplementedException.prototype.__class__ = new batavia.types.Type('NotImplementedException', [batavia.builtins.Exception]);

function NotImplementedError(msg) {
    batavia.builtins.Exception.call(this, 'NotImplementedError', msg);
}
batavia.builtins.NotImplementedError = NotImplementedError;
batavia.builtins.NotImplementedError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.NotImplementedError.prototype.__class__ = new batavia.types.Type('NotImplementedError', [batavia.builtins.Exception]);

function OSError(msg) {
    batavia.builtins.Exception.call(this, 'OSError', msg);
}
batavia.builtins.OSError = OSError;
batavia.builtins.OSError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.OSError.prototype.__class__ = new batavia.types.Type('OSError', [batavia.builtins.Exception]);

function OverflowError(msg) {
    batavia.builtins.Exception.call(this, 'OverflowError', msg);
}
batavia.builtins.OverflowError = OverflowError;
batavia.builtins.OverflowError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.OverflowError.prototype.__class__ = new batavia.types.Type('OverflowError', [batavia.builtins.Exception]);

batavia.builtins.PendingDeprecationWarning = undefined;

function PolyglotError(msg) {
    batavia.builtins.Exception.call(this, 'PolyglotError', msg);
}
batavia.builtins.PolyglotError = PolyglotError;
batavia.builtins.PolyglotError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.PolyglotError.prototype.__class__ = new batavia.types.Type('PolyglotError', [batavia.builtins.Exception]);

function ReferenceError(msg) {
    batavia.builtins.Exception.call(this, 'ReferenceError', msg);
}
batavia.builtins.ReferenceError = ReferenceError;
batavia.builtins.ReferenceError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.ReferenceError.prototype.__class__ = new batavia.types.Type('ReferenceError', [batavia.builtins.Exception]);

function RuntimeError(msg) {
    batavia.builtins.Exception.call(this, 'RuntimeError', msg);
}
batavia.builtins.RuntimeError = RuntimeError;
batavia.builtins.RuntimeError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.RuntimeError.prototype.__class__ = new batavia.types.Type('RuntimeError', [batavia.builtins.Exception]);

batavia.builtins.RuntimeWarning = undefined;

function StandardError(msg) {
    batavia.builtins.Exception.call(this, 'StandardError', msg);
}
batavia.builtins.StandardError = StandardError;
batavia.builtins.StandardError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.StandardError.prototype.__class__ = new batavia.types.Type('StandardError', [batavia.builtins.Exception]);

function StopIteration(msg) {
    batavia.builtins.Exception.call(this, 'StopIteration', msg);
}
batavia.builtins.StopIteration = StopIteration;
batavia.builtins.StopIteration.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.StopIteration.prototype.__class__ = new batavia.types.Type('StopIteration', [batavia.builtins.Exception]);

function SyntaxError(msg) {
    batavia.builtins.Exception.call(this, 'SyntaxError', msg);
}
batavia.builtins.SyntaxError = SyntaxError;
batavia.builtins.SyntaxError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.SyntaxError.prototype.__class__ = new batavia.types.Type('SyntaxError', [batavia.builtins.Exception]);

batavia.builtins.SyntaxWarning = undefined;

function SystemError(msg) {
    batavia.builtins.Exception.call(this, 'SystemError', msg);
}
batavia.builtins.SystemError = SystemError;
batavia.builtins.SystemError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.SystemError.prototype.__class__ = new batavia.types.Type('SystemError', [batavia.builtins.Exception]);

function TabError(msg) {
    batavia.builtins.Exception.call(this, 'TabError', msg);
}
batavia.builtins.TabError = TabError;
batavia.builtins.TabError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.TabError.prototype.__class__ = new batavia.types.Type('TabError', [batavia.builtins.Exception]);

function TypeError(msg) {
    batavia.builtins.Exception.call(this, 'TypeError', msg);
}
batavia.builtins.TypeError = TypeError;
batavia.builtins.TypeError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.TypeError.prototype.__class__ = new batavia.types.Type('TypeError', [batavia.builtins.Exception]);

function UnboundLocalError(msg) {
    batavia.builtins.Exception.call(this, 'UnboundLocalError', msg);
}
batavia.builtins.UnboundLocalError = UnboundLocalError;
batavia.builtins.UnboundLocalError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.UnboundLocalError.prototype.__class__ = new batavia.types.Type('UnboundLocalError', [batavia.builtins.Exception]);

function UnicodeDecodeError(msg) {
    batavia.builtins.Exception.call(this, 'UnicodeDecodeError', msg);
}
batavia.builtins.UnicodeDecodeError = UnicodeDecodeError;
batavia.builtins.UnicodeDecodeError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.UnicodeDecodeError.prototype.__class__ = new batavia.types.Type('UnicodeDecodeError', [batavia.builtins.Exception]);

function UnicodeEncodeError(msg) {
    batavia.builtins.Exception.call(this, 'UnicodeEncodeError', msg);
}
batavia.builtins.UnicodeEncodeError = UnicodeEncodeError;
batavia.builtins.UnicodeEncodeError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.UnicodeEncodeError.prototype.__class__ = new batavia.types.Type('UnicodeEncodeError', [batavia.builtins.Exception]);

function UnicodeError(msg) {
    batavia.builtins.Exception.call(this, 'UnicodeError', msg);
}
batavia.builtins.UnicodeError = UnicodeError;
batavia.builtins.UnicodeError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.UnicodeError.prototype.__class__ = new batavia.types.Type('UnicodeError', [batavia.builtins.Exception]);

function UnicodeTranslateError(msg) {
    batavia.builtins.Exception.call(this, 'UnicodeTranslateError', msg);
}
batavia.builtins.UnicodeTranslateError = UnicodeTranslateError;
batavia.builtins.UnicodeTranslateError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.UnicodeTranslateError.prototype.__class__ = new batavia.types.Type('UnicodeTranslateError', [batavia.builtins.Exception]);

batavia.builtins.UnicodeWarning = undefined;

batavia.builtins.UserWarning = undefined;

function ValueError(msg) {
    batavia.builtins.Exception.call(this, 'ValueError', msg);
}
batavia.builtins.ValueError = ValueError;
batavia.builtins.ValueError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.ValueError.prototype.__class__ = new batavia.types.Type('ValueError', [batavia.builtins.Exception]);

batavia.builtins.Warning = undefined;

function ZeroDivisionError(msg) {
    batavia.builtins.Exception.call(this, 'ZeroDivisionError', msg);
}
batavia.builtins.ZeroDivisionError = ZeroDivisionError;
batavia.builtins.ZeroDivisionError.prototype = Object.create(batavia.builtins.Exception.prototype);
batavia.builtins.ZeroDivisionError.prototype.__class__ = new batavia.types.Type('ZeroDivisionError', [batavia.builtins.Exception]);

