
batavia.builtins.BaseException = function(name, msg) {
    this.name = name;
    this.msg = msg;
};

batavia.builtins.BaseException.prototype.toString = function() {
    if (this.msg) {
        return this.name + ": " + this.msg;
    } else {
        return this.name;
    }
};

batavia.builtins.ArithmeticError = function(msg) {
    batavia.builtins.BaseException.call(this, 'ArithmeticError', msg);
};
batavia.builtins.ArithmeticError.prototype = Object.create(batavia.builtins.BaseException.prototype);

batavia.builtins.AssertionError = function(msg) {
    batavia.builtins.BaseException.call(this, 'AssertionError', msg);
};
batavia.builtins.AssertionError.prototype = Object.create(batavia.builtins.BaseException.prototype);

batavia.builtins.AttributeError = function(msg) {
    batavia.builtins.BaseException.call(this, 'AttributeError', msg);
};
batavia.builtins.AttributeError.prototype = Object.create(batavia.builtins.BaseException.prototype);

batavia.builtins.BufferError = function(msg) {
    batavia.builtins.BaseException.call(this, 'BufferError', msg);
};
batavia.builtins.BufferError.prototype = Object.create(batavia.builtins.BaseException.prototype);

batavia.builtins.BytesWarning = undefined;

batavia.builtins.DeprecationWarning = undefined;

batavia.builtins.EOFError = function(msg) {
    batavia.builtins.BaseException.call(this, 'EOFError', msg);
};
batavia.builtins.EOFError.prototype = Object.create(batavia.builtins.BaseException.prototype);

batavia.builtins.Ellipsis = undefined;

batavia.builtins.EnvironmentError = function(msg) {
    batavia.builtins.BaseException.call(this, 'EnvironmentError', msg);
};
batavia.builtins.EnvironmentError.prototype = Object.create(batavia.builtins.BaseException.prototype);

batavia.builtins.Exception = function(msg) {
    batavia.builtins.BaseException.call(this, 'Exception', msg);
};
batavia.builtins.Exception.prototype = Object.create(batavia.builtins.BaseException.prototype);

batavia.builtins.FloatingPointError = function(msg) {
    batavia.builtins.BaseException.call(this, 'FloatingPointError', msg);
};
batavia.builtins.FloatingPointError.prototype = Object.create(batavia.builtins.BaseException.prototype);

batavia.builtins.FutureWarning = undefined;

batavia.builtins.GeneratorExit = function(msg) {
    batavia.builtins.BaseException.call(this, 'GeneratorExit', msg);
};
batavia.builtins.GeneratorExit.prototype = Object.create(batavia.builtins.BaseException.prototype);

batavia.builtins.IOError = function(msg) {
    batavia.builtins.BaseException.call(this, 'IOError', msg);
};
batavia.builtins.IOError.prototype = Object.create(batavia.builtins.BaseException.prototype);

batavia.builtins.ImportError = function(msg) {
    batavia.builtins.BaseException.call(this, 'ImportError', msg);
};
batavia.builtins.ImportError.prototype = Object.create(batavia.builtins.BaseException.prototype);

batavia.builtins.ImportWarning = undefined;

batavia.builtins.IndentationError = function(msg) {
    batavia.builtins.BaseException.call(this, 'IndentationError', msg);
};
batavia.builtins.IndentationError.prototype = Object.create(batavia.builtins.BaseException.prototype);

batavia.builtins.IndexError = function(msg) {
    batavia.builtins.BaseException.call(this, 'IndexError', msg);
};
batavia.builtins.IndexError.prototype = Object.create(batavia.builtins.BaseException.prototype);

batavia.builtins.KeyError = function(msg) {
    batavia.builtins.BaseException.call(this, 'KeyError', msg);
};
batavia.builtins.KeyError.prototype = Object.create(batavia.builtins.BaseException.prototype);

batavia.builtins.KeyboardInterrupt = function(msg) {
    batavia.builtins.BaseException.call(this, 'KeyboardInterrupt', msg);
};
batavia.builtins.KeyboardInterrupt.prototype = Object.create(batavia.builtins.BaseException.prototype);

batavia.builtins.LookupError = function(msg) {
    batavia.builtins.BaseException.call(this, 'LookupError', msg);
};
batavia.builtins.LookupError.prototype = Object.create(batavia.builtins.BaseException.prototype);

batavia.builtins.MemoryError = function(msg) {
    batavia.builtins.BaseException.call(this, 'MemoryError', msg);
};
batavia.builtins.MemoryError.prototype = Object.create(batavia.builtins.BaseException.prototype);

batavia.builtins.NameError = function(msg) {
    batavia.builtins.BaseException.call(this, 'NameError', msg);
};
batavia.builtins.NameError.prototype = Object.create(batavia.builtins.BaseException.prototype);

batavia.builtins.NotImplemented = function(msg) {
    batavia.builtins.BaseException.call(this, 'NotImplemented', msg);
};
batavia.builtins.NotImplemented.prototype = Object.create(batavia.builtins.BaseException.prototype);

batavia.builtins.NotImplementedError = function(msg) {
    batavia.builtins.BaseException.call(this, 'NotImplementedError', msg);
};
batavia.builtins.NotImplementedError.prototype = Object.create(batavia.builtins.BaseException.prototype);

batavia.builtins.OSError = function(msg) {
    batavia.builtins.BaseException.call(this, 'OSError', msg);
};
batavia.builtins.OSError.prototype = Object.create(batavia.builtins.BaseException.prototype);

batavia.builtins.OverflowError = function(msg) {
    batavia.builtins.BaseException.call(this, 'OverflowError', msg);
};
batavia.builtins.OverflowError.prototype = Object.create(batavia.builtins.BaseException.prototype);

batavia.builtins.PendingDeprecationWarning = undefined;

batavia.builtins.ReferenceError = function(msg) {
    batavia.builtins.BaseException.call(this, 'ReferenceError', msg);
};
batavia.builtins.ReferenceError.prototype = Object.create(batavia.builtins.BaseException.prototype);

batavia.builtins.RuntimeError = function(msg) {
    batavia.builtins.BaseException.call(this, 'RuntimeError', msg);
};
batavia.builtins.RuntimeError.prototype = Object.create(batavia.builtins.BaseException.prototype);

batavia.builtins.RuntimeWarning = undefined;

batavia.builtins.StandardError = function(msg) {
    batavia.builtins.BaseException.call(this, 'StandardError', msg);
};
batavia.builtins.StandardError.prototype = Object.create(batavia.builtins.BaseException.prototype);

batavia.builtins.StopIteration = function(msg) {
    batavia.builtins.BaseException.call(this, 'StopIteration', msg);
};
batavia.builtins.StopIteration.prototype = Object.create(batavia.builtins.BaseException.prototype);

batavia.builtins.SyntaxError = function(msg) {
    batavia.builtins.BaseException.call(this, 'SyntaxError', msg);
};
batavia.builtins.SyntaxError.prototype = Object.create(batavia.builtins.BaseException.prototype);

batavia.builtins.SyntaxWarning = undefined;

batavia.builtins.SystemError = function(msg) {
    batavia.builtins.BaseException.call(this, 'SystemError', msg);
};
batavia.builtins.SystemError.prototype = Object.create(batavia.builtins.BaseException.prototype);

batavia.builtins.SystemExit = function(msg) {
    batavia.builtins.BaseException.call(this, 'SystemExit', msg);
};
batavia.builtins.SystemExit.prototype = Object.create(batavia.builtins.BaseException.prototype);

batavia.builtins.TabError = function(msg) {
    batavia.builtins.BaseException.call(this, 'TabError', msg);
};
batavia.builtins.TabError.prototype = Object.create(batavia.builtins.BaseException.prototype);

batavia.builtins.TypeError = function(msg) {
    batavia.builtins.BaseException.call(this, 'TypeError', msg);
};
batavia.builtins.TypeError.prototype = Object.create(batavia.builtins.BaseException.prototype);

batavia.builtins.UnboundLocalError = function(msg) {
    batavia.builtins.BaseException.call(this, 'UnboundLocalError', msg);
};
batavia.builtins.UnboundLocalError.prototype = Object.create(batavia.builtins.BaseException.prototype);

batavia.builtins.UnicodeDecodeError = function(msg) {
    batavia.builtins.BaseException.call(this, 'UnicodeDecodeError', msg);
};
batavia.builtins.UnicodeDecodeError.prototype = Object.create(batavia.builtins.BaseException.prototype);

batavia.builtins.UnicodeEncodeError = function(msg) {
    batavia.builtins.BaseException.call(this, 'UnicodeEncodeError', msg);
};
batavia.builtins.UnicodeEncodeError.prototype = Object.create(batavia.builtins.BaseException.prototype);

batavia.builtins.UnicodeError = function(msg) {
    batavia.builtins.BaseException.call(this, 'UnicodeError', msg);
};
batavia.builtins.UnicodeError.prototype = Object.create(batavia.builtins.BaseException.prototype);

batavia.builtins.UnicodeTranslateError = function(msg) {
    batavia.builtins.BaseException.call(this, 'UnicodeTranslateError', msg);
};
batavia.builtins.UnicodeTranslateError.prototype = Object.create(batavia.builtins.BaseException.prototype);

batavia.builtins.UnicodeWarning = undefined;

batavia.builtins.UserWarning = undefined;

batavia.builtins.ValueError = function(msg) {
    batavia.builtins.BaseException.call(this, 'ValueError', msg);
};
batavia.builtins.ValueError.prototype = Object.create(batavia.builtins.BaseException.prototype);

batavia.builtins.Warning = undefined;

batavia.builtins.ZeroDivisionError = function(msg) {
    batavia.builtins.BaseException.call(this, 'ZeroDivisionError', msg);
};
batavia.builtins.ZeroDivisionError.prototype = Object.create(batavia.builtins.BaseException.prototype);

