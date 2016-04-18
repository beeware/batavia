
BaseException = function(name, msg) {
    this.name = name;
    this.msg = msg;
};
batavia.builtins.BaseException = BaseException;
batavia.builtins.BaseException.prototype.toString = function() {
    if (this.msg) {
        return this.name + ": " + this.msg;
    } else {
        return this.name;
    }
};

function BataviaError(msg) {
    batavia.builtins.BaseException.call(this, 'BataviaError', msg);
}
batavia.builtins.BataviaError = BataviaError;
batavia.builtins.BataviaError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.BataviaError.prototype.constructor = BataviaError;

function ArithmeticError(msg) {
    batavia.builtins.BaseException.call(this, 'ArithmeticError', msg);
}
batavia.builtins.ArithmeticError = ArithmeticError;
batavia.builtins.ArithmeticError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.ArithmeticError.prototype.constructor = ArithmeticError;

function AssertionError(msg) {
    batavia.builtins.BaseException.call(this, 'AssertionError', msg);
}
batavia.builtins.AssertionError = AssertionError;
batavia.builtins.AssertionError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.AssertionError.prototype.constructor = AssertionError;

function AttributeError(msg) {
    batavia.builtins.BaseException.call(this, 'AttributeError', msg);
}
batavia.builtins.AttributeError = AttributeError;
batavia.builtins.AttributeError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.AttributeError.prototype.constructor = AttributeError;

function BufferError(msg) {
    batavia.builtins.BaseException.call(this, 'BufferError', msg);
}
batavia.builtins.BufferError = BufferError;
batavia.builtins.BufferError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.BufferError.prototype.constructor = BufferError;

batavia.builtins.BytesWarning = undefined;

batavia.builtins.DeprecationWarning = undefined;

function EOFError(msg) {
    batavia.builtins.BaseException.call(this, 'EOFError', msg);
}
batavia.builtins.EOFError = EOFError;
batavia.builtins.EOFError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.EOFError.prototype.constructor = EOFError;

batavia.builtins.Ellipsis = undefined;

function EnvironmentError(msg) {
    batavia.builtins.BaseException.call(this, 'EnvironmentError', msg);
}
batavia.builtins.EnvironmentError = EnvironmentError;
batavia.builtins.EnvironmentError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.EnvironmentError.prototype.constructor = EnvironmentError;

function Exception(msg) {
    batavia.builtins.BaseException.call(this, 'Exception', msg);
}
batavia.builtins.Exception = Exception;
batavia.builtins.Exception.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.Exception.prototype.constructor = Exception;

function FloatingPointError(msg) {
    batavia.builtins.BaseException.call(this, 'FloatingPointError', msg);
}
batavia.builtins.FloatingPointError = FloatingPointError;
batavia.builtins.FloatingPointError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.FloatingPointError.prototype.constructor = FloatingPointError;

batavia.builtins.FutureWarning = undefined;

function GeneratorExit(msg) {
    batavia.builtins.BaseException.call(this, 'GeneratorExit', msg);
}
batavia.builtins.GeneratorExit = GeneratorExit;
batavia.builtins.GeneratorExit.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.GeneratorExit.prototype.constructor = GeneratorExit;

function IOError(msg) {
    batavia.builtins.BaseException.call(this, 'IOError', msg);
}
batavia.builtins.IOError = IOError;
batavia.builtins.IOError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.IOError.prototype.constructor = IOError;

function ImportError(msg) {
    batavia.builtins.BaseException.call(this, 'ImportError', msg);
}
batavia.builtins.ImportError = ImportError;
batavia.builtins.ImportError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.ImportError.prototype.constructor = ImportError;

batavia.builtins.ImportWarning = undefined;

function IndentationError(msg) {
    batavia.builtins.BaseException.call(this, 'IndentationError', msg);
}
batavia.builtins.IndentationError = IndentationError;
batavia.builtins.IndentationError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.IndentationError.prototype.constructor = IndentationError;

function IndexError(msg) {
    batavia.builtins.BaseException.call(this, 'IndexError', msg);
}
batavia.builtins.IndexError = IndexError;
batavia.builtins.IndexError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.IndexError.prototype.constructor = IndexError;

function KeyError(key) {
    var msg;
    if (key === null) {
        msg = "None";
    } else if (key['__repr__'] && !key.hasOwnProperty('__repr__')) {
        msg = key.__repr__();
    } else {
        msg = key.toString();
    }
    batavia.builtins.BaseException.call(this, 'KeyError', msg);
}
batavia.builtins.KeyError = KeyError;
batavia.builtins.KeyError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.KeyError.prototype.constructor = KeyError;

function KeyboardInterrupt(msg) {
    batavia.builtins.BaseException.call(this, 'KeyboardInterrupt', msg);
}
batavia.builtins.KeyboardInterrupt = KeyboardInterrupt;
batavia.builtins.KeyboardInterrupt.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.KeyboardInterrupt.prototype.constructor = KeyboardInterrupt;

function LookupError(msg) {
    batavia.builtins.BaseException.call(this, 'LookupError', msg);
}
batavia.builtins.LookupError = LookupError;
batavia.builtins.LookupError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.LookupError.prototype.constructor = LookupError;

function MemoryError(msg) {
    batavia.builtins.BaseException.call(this, 'MemoryError', msg);
}
batavia.builtins.MemoryError = MemoryError;
batavia.builtins.MemoryError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.MemoryError.prototype.constructor = MemoryError;

function NameError(msg) {
    batavia.builtins.BaseException.call(this, 'NameError', msg);
}
batavia.builtins.NameError = NameError;
batavia.builtins.NameError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.NameError.prototype.constructor = NameError;

function NotImplemented(msg) {
    batavia.builtins.BaseException.call(this, 'NotImplemented', msg);
}
batavia.builtins.NotImplemented = NotImplemented;
batavia.builtins.NotImplemented.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.NotImplemented.prototype.constructor = NotImplemented;

function NotImplementedError(msg) {
    batavia.builtins.BaseException.call(this, 'NotImplementedError', msg);
}
batavia.builtins.NotImplementedError = NotImplementedError;
batavia.builtins.NotImplementedError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.NotImplementedError.prototype.constructor = NotImplementedError;

function OSError(msg) {
    batavia.builtins.BaseException.call(this, 'OSError', msg);
}
batavia.builtins.OSError = OSError;
batavia.builtins.OSError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.OSError.prototype.constructor = OSError;

function OverflowError(msg) {
    batavia.builtins.BaseException.call(this, 'OverflowError', msg);
}
batavia.builtins.OverflowError = OverflowError;
batavia.builtins.OverflowError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.OverflowError.prototype.constructor = OverflowError;

batavia.builtins.PendingDeprecationWarning = undefined;

function ReferenceError(msg) {
    batavia.builtins.BaseException.call(this, 'ReferenceError', msg);
}
batavia.builtins.ReferenceError = ReferenceError;
batavia.builtins.ReferenceError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.ReferenceError.prototype.constructor = ReferenceError;

function RuntimeError(msg) {
    batavia.builtins.BaseException.call(this, 'RuntimeError', msg);
}
batavia.builtins.RuntimeError = RuntimeError;
batavia.builtins.RuntimeError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.RuntimeError.prototype.constructor = RuntimeError;

batavia.builtins.RuntimeWarning = undefined;

function StandardError(msg) {
    batavia.builtins.BaseException.call(this, 'StandardError', msg);
}
batavia.builtins.StandardError = StandardError;
batavia.builtins.StandardError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.StandardError.prototype.constructor = StandardError;

function StopIteration(msg) {
    batavia.builtins.BaseException.call(this, 'StopIteration', msg);
}
batavia.builtins.StopIteration = StopIteration;
batavia.builtins.StopIteration.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.StopIteration.prototype.constructor = StopIteration;

function SyntaxError(msg) {
    batavia.builtins.BaseException.call(this, 'SyntaxError', msg);
}
batavia.builtins.SyntaxError = SyntaxError;
batavia.builtins.SyntaxError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.SyntaxError.prototype.constructor = SyntaxError;

batavia.builtins.SyntaxWarning = undefined;

function SystemError(msg) {
    batavia.builtins.BaseException.call(this, 'SystemError', msg);
}
batavia.builtins.SystemError = SystemError;
batavia.builtins.SystemError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.SystemError.prototype.constructor = SystemError;

function SystemExit(msg) {
    batavia.builtins.BaseException.call(this, 'SystemExit', msg);
}
batavia.builtins.SystemExit = SystemExit;
batavia.builtins.SystemExit.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.SystemExit.prototype.constructor = SystemExit;

function TabError(msg) {
    batavia.builtins.BaseException.call(this, 'TabError', msg);
}
batavia.builtins.TabError = TabError;
batavia.builtins.TabError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.TabError.prototype.constructor = TabError;

function TypeError(msg) {
    batavia.builtins.BaseException.call(this, 'TypeError', msg);
}
batavia.builtins.TypeError = TypeError;
batavia.builtins.TypeError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.TypeError.prototype.constructor = TypeError;

function UnboundLocalError(msg) {
    batavia.builtins.BaseException.call(this, 'UnboundLocalError', msg);
}
batavia.builtins.UnboundLocalError = UnboundLocalError;
batavia.builtins.UnboundLocalError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.UnboundLocalError.prototype.constructor = UnboundLocalError;

function UnicodeDecodeError(msg) {
    batavia.builtins.BaseException.call(this, 'UnicodeDecodeError', msg);
}
batavia.builtins.UnicodeDecodeError = UnicodeDecodeError;
batavia.builtins.UnicodeDecodeError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.UnicodeDecodeError.prototype.constructor = UnicodeDecodeError;

function UnicodeEncodeError(msg) {
    batavia.builtins.BaseException.call(this, 'UnicodeEncodeError', msg);
}
batavia.builtins.UnicodeEncodeError = UnicodeEncodeError;
batavia.builtins.UnicodeEncodeError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.UnicodeEncodeError.prototype.constructor = UnicodeEncodeError;

function UnicodeError(msg) {
    batavia.builtins.BaseException.call(this, 'UnicodeError', msg);
}
batavia.builtins.UnicodeError = UnicodeError;
batavia.builtins.UnicodeError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.UnicodeError.prototype.constructor = UnicodeError;

function UnicodeTranslateError(msg) {
    batavia.builtins.BaseException.call(this, 'UnicodeTranslateError', msg);
}
batavia.builtins.UnicodeTranslateError = UnicodeTranslateError;
batavia.builtins.UnicodeTranslateError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.UnicodeTranslateError.prototype.constructor = UnicodeTranslateError;

batavia.builtins.UnicodeWarning = undefined;

batavia.builtins.UserWarning = undefined;

function ValueError(msg) {
    batavia.builtins.BaseException.call(this, 'ValueError', msg);
}
batavia.builtins.ValueError = ValueError;
batavia.builtins.ValueError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.ValueError.prototype.constructor = ValueError;

batavia.builtins.Warning = undefined;

function ZeroDivisionError(msg) {
    batavia.builtins.BaseException.call(this, 'ZeroDivisionError', msg);
}
batavia.builtins.ZeroDivisionError = ZeroDivisionError;
batavia.builtins.ZeroDivisionError.prototype = Object.create(batavia.builtins.BaseException.prototype);
batavia.builtins.ZeroDivisionError.prototype.constructor = ZeroDivisionError;

