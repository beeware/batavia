
batavia.exceptions.BaseException = function(name, msg) {
    this.name = name;
    this.msg = msg;
};

batavia.exceptions.BaseException.prototype.toString = function() {
    if (this.msg) {
        return this.name + ": " + this.msg;
    } else {
        return this.name;
    }
};

batavia.exceptions.ArithmeticError = function(msg) {
    batavia.exceptions.BaseException.call(this, 'ArithmeticError', msg);
};
batavia.exceptions.ArithmeticError.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.ArithmeticError = function(args, kwargs) {
    return new batavia.exceptions.ArithmeticError(args[0]);
};

batavia.exceptions.AssertionError = function(msg) {
    batavia.exceptions.BaseException.call(this, 'AssertionError', msg);
};
batavia.exceptions.AssertionError.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.AssertionError = function(args, kwargs) {
    return new batavia.exceptions.AssertionError(args[0]);
};

batavia.exceptions.AttributeError = function(msg) {
    batavia.exceptions.BaseException.call(this, 'AttributeError', msg);
};
batavia.exceptions.AttributeError.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.AttributeError = function(args, kwargs) {
    return new batavia.exceptions.AttributeError(args[0]);
};

batavia.exceptions.BufferError = function(msg) {
    batavia.exceptions.BaseException.call(this, 'BufferError', msg);
};
batavia.exceptions.BufferError.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.BufferError = function(args, kwargs) {
    return new batavia.exceptions.BufferError(args[0]);
};

batavia.exceptions.BytesWarning = undefined;

batavia.exceptions.DeprecationWarning = undefined;

batavia.exceptions.EOFError = function(msg) {
    batavia.exceptions.BaseException.call(this, 'EOFError', msg);
};
batavia.exceptions.EOFError.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.EOFError = function(args, kwargs) {
    return new batavia.exceptions.EOFError(args[0]);
};

batavia.exceptions.Ellipsis = undefined;

batavia.exceptions.EnvironmentError = function(msg) {
    batavia.exceptions.BaseException.call(this, 'EnvironmentError', msg);
};
batavia.exceptions.EnvironmentError.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.EnvironmentError = function(args, kwargs) {
    return new batavia.exceptions.EnvironmentError(args[0]);
};

batavia.exceptions.Exception = function(msg) {
    batavia.exceptions.BaseException.call(this, 'Exception', msg);
};
batavia.exceptions.Exception.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.Exception = function(args, kwargs) {
    return new batavia.exceptions.Exception(args[0]);
};

batavia.exceptions.FloatingPointError = function(msg) {
    batavia.exceptions.BaseException.call(this, 'FloatingPointError', msg);
};
batavia.exceptions.FloatingPointError.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.FloatingPointError = function(args, kwargs) {
    return new batavia.exceptions.FloatingPointError(args[0]);
};

batavia.exceptions.FutureWarning = undefined;

batavia.exceptions.GeneratorExit = function(msg) {
    batavia.exceptions.BaseException.call(this, 'GeneratorExit', msg);
};
batavia.exceptions.GeneratorExit.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.GeneratorExit = function(args, kwargs) {
    return new batavia.exceptions.GeneratorExit(args[0]);
};

batavia.exceptions.IOError = function(msg) {
    batavia.exceptions.BaseException.call(this, 'IOError', msg);
};
batavia.exceptions.IOError.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.IOError = function(args, kwargs) {
    return new batavia.exceptions.IOError(args[0]);
};

batavia.exceptions.ImportError = function(msg) {
    batavia.exceptions.BaseException.call(this, 'ImportError', msg);
};
batavia.exceptions.ImportError.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.ImportError = function(args, kwargs) {
    return new batavia.exceptions.ImportError(args[0]);
};

batavia.exceptions.ImportWarning = undefined;

batavia.exceptions.IndentationError = function(msg) {
    batavia.exceptions.BaseException.call(this, 'IndentationError', msg);
};
batavia.exceptions.IndentationError.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.IndentationError = function(args, kwargs) {
    return new batavia.exceptions.IndentationError(args[0]);
};

batavia.exceptions.IndexError = function(msg) {
    batavia.exceptions.BaseException.call(this, 'IndexError', msg);
};
batavia.exceptions.IndexError.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.IndexError = function(args, kwargs) {
    return new batavia.exceptions.IndexError(args[0]);
};

batavia.exceptions.KeyError = function(msg) {
    batavia.exceptions.BaseException.call(this, 'KeyError', msg);
};
batavia.exceptions.KeyError.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.KeyError = function(args, kwargs) {
    return new batavia.exceptions.KeyError(args[0]);
};

batavia.exceptions.KeyboardInterrupt = function(msg) {
    batavia.exceptions.BaseException.call(this, 'KeyboardInterrupt', msg);
};
batavia.exceptions.KeyboardInterrupt.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.KeyboardInterrupt = function(args, kwargs) {
    return new batavia.exceptions.KeyboardInterrupt(args[0]);
};

batavia.exceptions.LookupError = function(msg) {
    batavia.exceptions.BaseException.call(this, 'LookupError', msg);
};
batavia.exceptions.LookupError.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.LookupError = function(args, kwargs) {
    return new batavia.exceptions.LookupError(args[0]);
};

batavia.exceptions.MemoryError = function(msg) {
    batavia.exceptions.BaseException.call(this, 'MemoryError', msg);
};
batavia.exceptions.MemoryError.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.MemoryError = function(args, kwargs) {
    return new batavia.exceptions.MemoryError(args[0]);
};

batavia.exceptions.NameError = function(msg) {
    batavia.exceptions.BaseException.call(this, 'NameError', msg);
};
batavia.exceptions.NameError.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.NameError = function(args, kwargs) {
    return new batavia.exceptions.NameError(args[0]);
};

batavia.exceptions.NotImplemented = function(msg) {
    batavia.exceptions.BaseException.call(this, 'NotImplemented', msg);
};
batavia.exceptions.NotImplemented.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.NotImplemented = function(args, kwargs) {
    return new batavia.exceptions.NotImplemented(args[0]);
};

batavia.exceptions.NotImplementedError = function(msg) {
    batavia.exceptions.BaseException.call(this, 'NotImplementedError', msg);
};
batavia.exceptions.NotImplementedError.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.NotImplementedError = function(args, kwargs) {
    return new batavia.exceptions.NotImplementedError(args[0]);
};

batavia.exceptions.OSError = function(msg) {
    batavia.exceptions.BaseException.call(this, 'OSError', msg);
};
batavia.exceptions.OSError.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.OSError = function(args, kwargs) {
    return new batavia.exceptions.OSError(args[0]);
};

batavia.exceptions.OverflowError = function(msg) {
    batavia.exceptions.BaseException.call(this, 'OverflowError', msg);
};
batavia.exceptions.OverflowError.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.OverflowError = function(args, kwargs) {
    return new batavia.exceptions.OverflowError(args[0]);
};

batavia.exceptions.PendingDeprecationWarning = undefined;

batavia.exceptions.ReferenceError = function(msg) {
    batavia.exceptions.BaseException.call(this, 'ReferenceError', msg);
};
batavia.exceptions.ReferenceError.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.ReferenceError = function(args, kwargs) {
    return new batavia.exceptions.ReferenceError(args[0]);
};

batavia.exceptions.RuntimeError = function(msg) {
    batavia.exceptions.BaseException.call(this, 'RuntimeError', msg);
};
batavia.exceptions.RuntimeError.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.RuntimeError = function(args, kwargs) {
    return new batavia.exceptions.RuntimeError(args[0]);
};

batavia.exceptions.RuntimeWarning = undefined;

batavia.exceptions.StandardError = function(msg) {
    batavia.exceptions.BaseException.call(this, 'StandardError', msg);
};
batavia.exceptions.StandardError.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.StandardError = function(args, kwargs) {
    return new batavia.exceptions.StandardError(args[0]);
};

batavia.exceptions.StopIteration = function(msg) {
    batavia.exceptions.BaseException.call(this, 'StopIteration', msg);
};
batavia.exceptions.StopIteration.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.StopIteration = function(args, kwargs) {
    return new batavia.exceptions.StopIteration(args[0]);
};

batavia.exceptions.SyntaxError = function(msg) {
    batavia.exceptions.BaseException.call(this, 'SyntaxError', msg);
};
batavia.exceptions.SyntaxError.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.SyntaxError = function(args, kwargs) {
    return new batavia.exceptions.SyntaxError(args[0]);
};

batavia.exceptions.SyntaxWarning = undefined;

batavia.exceptions.SystemError = function(msg) {
    batavia.exceptions.BaseException.call(this, 'SystemError', msg);
};
batavia.exceptions.SystemError.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.SystemError = function(args, kwargs) {
    return new batavia.exceptions.SystemError(args[0]);
};

batavia.exceptions.SystemExit = function(msg) {
    batavia.exceptions.BaseException.call(this, 'SystemExit', msg);
};
batavia.exceptions.SystemExit.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.SystemExit = function(args, kwargs) {
    return new batavia.exceptions.SystemExit(args[0]);
};

batavia.exceptions.TabError = function(msg) {
    batavia.exceptions.BaseException.call(this, 'TabError', msg);
};
batavia.exceptions.TabError.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.TabError = function(args, kwargs) {
    return new batavia.exceptions.TabError(args[0]);
};

batavia.exceptions.TypeError = function(msg) {
    batavia.exceptions.BaseException.call(this, 'TypeError', msg);
};
batavia.exceptions.TypeError.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.TypeError = function(args, kwargs) {
    return new batavia.exceptions.TypeError(args[0]);
};

batavia.exceptions.UnboundLocalError = function(msg) {
    batavia.exceptions.BaseException.call(this, 'UnboundLocalError', msg);
};
batavia.exceptions.UnboundLocalError.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.UnboundLocalError = function(args, kwargs) {
    return new batavia.exceptions.UnboundLocalError(args[0]);
};

batavia.exceptions.UnicodeDecodeError = function(msg) {
    batavia.exceptions.BaseException.call(this, 'UnicodeDecodeError', msg);
};
batavia.exceptions.UnicodeDecodeError.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.UnicodeDecodeError = function(args, kwargs) {
    return new batavia.exceptions.UnicodeDecodeError(args[0]);
};

batavia.exceptions.UnicodeEncodeError = function(msg) {
    batavia.exceptions.BaseException.call(this, 'UnicodeEncodeError', msg);
};
batavia.exceptions.UnicodeEncodeError.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.UnicodeEncodeError = function(args, kwargs) {
    return new batavia.exceptions.UnicodeEncodeError(args[0]);
};

batavia.exceptions.UnicodeError = function(msg) {
    batavia.exceptions.BaseException.call(this, 'UnicodeError', msg);
};
batavia.exceptions.UnicodeError.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.UnicodeError = function(args, kwargs) {
    return new batavia.exceptions.UnicodeError(args[0]);
};

batavia.exceptions.UnicodeTranslateError = function(msg) {
    batavia.exceptions.BaseException.call(this, 'UnicodeTranslateError', msg);
};
batavia.exceptions.UnicodeTranslateError.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.UnicodeTranslateError = function(args, kwargs) {
    return new batavia.exceptions.UnicodeTranslateError(args[0]);
};

batavia.exceptions.UnicodeWarning = undefined;

batavia.exceptions.UserWarning = undefined;

batavia.exceptions.ValueError = function(msg) {
    batavia.exceptions.BaseException.call(this, 'ValueError', msg);
};
batavia.exceptions.ValueError.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.ValueError = function(args, kwargs) {
    return new batavia.exceptions.ValueError(args[0]);
};

batavia.exceptions.Warning = undefined;

batavia.exceptions.ZeroDivisionError = function(msg) {
    batavia.exceptions.BaseException.call(this, 'ZeroDivisionError', msg);
};
batavia.exceptions.ZeroDivisionError.prototype = Object.create(batavia.exceptions.BaseException.prototype);
batavia.builtins.ZeroDivisionError = function(args, kwargs) {
    return new batavia.exceptions.ZeroDivisionError(args[0]);
};

