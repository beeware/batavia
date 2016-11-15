var types = require('../types/Type');

module.exports = function() {
    var exceptions = {};

    /*****************************************************************
     * Root exception
     *****************************************************************/
    BaseException = function(name, msg) {
        this.name = name;
        this.msg = msg;
    }

    BaseException.__class__ = new types.Type('BaseException', [types.Object]);
    BaseException.prototype.__class__ = BaseException.__class__;

    BaseException.prototype.toString = function() {
        return this.__str__();
    }

    BaseException.prototype.__str__ = function() {
        if (this.msg) {
            return this.msg;
        } else {
            return '';
        }
    }

    BaseException.prototype.__repr__ = function() {
        if (this.msg) {
            return this.name + "(" + this.msg + ")";
        } else {
            return this.name + "()";
        }
    }

    exceptions['BaseException'] = BaseException

    /*****************************************************************
     * Top level exceptions
     *****************************************************************/

    function SystemExit(msg) {
        BaseException.call(this, 'SystemExit', msg);
    }
    SystemExit.prototype = Object.create(BaseException.prototype);
    SystemExit.__class__ = new types.Type('SystemExit', [BaseException]);
    SystemExit.prototype.__class__ = SystemExit.__class__;
    exceptions['SystemExit'] = SystemExit;

    function KeyboardInterrupt(msg) {
        BaseException.call(this, 'KeyboardInterrupt', msg);
    }
    KeyboardInterrupt.prototype = Object.create(BaseException.prototype);
    KeyboardInterrupt.__class__ = new types.Type('KeyboardInterrupt', [BaseException]);
    KeyboardInterrupt.prototype.__class__ = KeyboardInterrupt.__class__;
    exceptions['KeyboardInterrupt'] = KeyboardInterrupt;

    function GeneratorExit(msg) {
        BaseException.call(this, 'GeneratorExit', msg);
    }
    GeneratorExit.prototype = Object.create(BaseException.prototype);
    GeneratorExit.__class__ = new types.Type('GeneratorExit', [BaseException]);
    GeneratorExit.prototype.__class__ = GeneratorExit.__class__;
    exceptions['GeneratorExit'] = GeneratorExit;

    function Exception(name, msg) {
        if (arguments.length == 1) {
            // If only one argument is provided, it will be the message.
            BaseException.call(this, 'Exception', name);
        } else {
            BaseException.call(this, name, msg);
        }
    }
    Exception.prototype = Object.create(BaseException.prototype);
    Exception.__class__ = new types.Type('Exception', [BaseException]);
    Exception.prototype.__class__ = Exception.__class__;
    exceptions['Exception'] = Exception;

    /*****************************************************************
     * All other exceptions
     *****************************************************************/

    function BataviaError(msg) {
        Exception.call(this, 'BataviaError', msg);
    }
    BataviaError.prototype = Object.create(Exception.prototype);
    BataviaError.__class__ = new types.Type('BataviaError', [Exception]);
    BataviaError.prototype.__class__ = BataviaError.__class__;
    exceptions['BataviaError'] = BataviaError;

    function ArithmeticError(msg) {
        Exception.call(this, 'ArithmeticError', msg);
    }
    ArithmeticError.prototype = Object.create(Exception.prototype);
    ArithmeticError.__class__ = new types.Type('ArithmeticError', [Exception]);
    ArithmeticError.prototype.__class__ = ArithmeticError.__class__;
    exceptions['ArithmeticError'] = ArithmeticError;

    function AssertionError(msg) {
        Exception.call(this, 'AssertionError', msg);
    }
    AssertionError.prototype = Object.create(Exception.prototype);
    AssertionError.__class__ = new types.Type('AssertionError', [Exception]);
    AssertionError.prototype.__class__ = AssertionError.__class__;
    exceptions['AssertionError'] = AssertionError;

    function AttributeError(msg) {
        Exception.call(this, 'AttributeError', msg);
    }
    AttributeError.prototype = Object.create(Exception.prototype);
    AttributeError.__class__ = new types.Type('AttributeError', [Exception]);
    AttributeError.prototype.__class__ = AttributeError.__class__;
    exceptions['AttributeError'] = AttributeError;

    function BufferError(msg) {
        Exception.call(this, 'BufferError', msg);
    }
    BufferError.prototype = Object.create(Exception.prototype);
    BufferError.__class__ = new types.Type('BufferError', [Exception]);
    BufferError.prototype.__class__ = BufferError.__class__;
    exceptions['BufferError'] = BufferError;

    BytesWarning = undefined;

    DeprecationWarning = undefined;

    function EOFError(msg) {
        Exception.call(this, 'EOFError', msg);
    }
    EOFError.prototype = Object.create(Exception.prototype);
    EOFError.__class__ = new types.Type('EOFError', [Exception]);
    EOFError.prototype.__class__ = EOFError.__class__;
    exceptions['EOFError'] = EOFError;

    function EnvironmentError(msg) {
        Exception.call(this, 'EnvironmentError', msg);
    }
    EnvironmentError.prototype = Object.create(Exception.prototype);
    EnvironmentError.__class__ = new types.Type('EnvironmentError', [Exception]);
    EnvironmentError.prototype.__class__ = EnvironmentError.__class__;
    exceptions['EnvironmentError'] = EnvironmentError;

    function FloatingPointError(msg) {
        Exception.call(this, 'FloatingPointError', msg);
    }
    FloatingPointError.prototype = Object.create(Exception.prototype);
    FloatingPointError.__class__ = new types.Type('FloatingPointError', [Exception]);
    FloatingPointError.prototype.__class__ = FloatingPointError.__class__;
    exceptions['FloatingPointError'] = FloatingPointError;

    FutureWarning = undefined;

    function IOError(msg) {
        Exception.call(this, 'IOError', msg);
    }
    IOError.prototype = Object.create(Exception.prototype);
    IOError.__class__ = new types.Type('IOError', [Exception]);
    IOError.prototype.__class__ = IOError.__class__;
    exceptions['IOError'] = IOError;

    function ImportError(msg) {
        Exception.call(this, 'ImportError', msg);
    }
    ImportError.prototype = Object.create(Exception.prototype);
    ImportError.__class__ = new types.Type('ImportError', [Exception]);
    ImportError.prototype.__class__ = ImportError.__class__;
    exceptions['ImportError'] = ImportError;

    ImportWarning = undefined;

    function IndentationError(msg) {
        Exception.call(this, 'IndentationError', msg);
    }
    IndentationError.prototype = Object.create(Exception.prototype);
    IndentationError.__class__ = new types.Type('IndentationError', [Exception]);
    IndentationError.prototype.__class__ = IndentationError.__class__;
    exceptions['IndentationError'] = IndentationError;

    function IndexError(msg) {
        Exception.call(this, 'IndexError', msg);
    }
    IndexError.prototype = Object.create(Exception.prototype);
    IndexError.__class__ = new types.Type('IndexError', [Exception]);
    IndexError.prototype.__class__ = IndexError.__class__;
    exceptions['IndexError'] = IndexError;

    function KeyError(key) {
        var msg;
        if (key === null) {
            msg = "None";
        } else if (key['__repr__'] && !key.hasOwnProperty('__repr__')) {
            msg = key.__repr__();
        } else {
            msg = key.toString();
        }
        Exception.call(this, 'KeyError', msg);
    }
    KeyError.prototype = Object.create(Exception.prototype);
    KeyError.__class__ = new types.Type('KeyError', [Exception], null, KeyError);
    KeyError.prototype.__class__ = KeyError.__class__;
    exceptions['KeyError'] = KeyError;

    function LookupError(msg) {
        Exception.call(this, 'LookupError', msg);
    }
    LookupError.prototype = Object.create(Exception.prototype);
    LookupError.__class__ = new types.Type('LookupError', [Exception]);
    LookupError.prototype.__class__ = LookupError.__class__;
    exceptions['LookupError'] = LookupError;

    function MemoryError(msg) {
        Exception.call(this, 'MemoryError', msg);
    }
    MemoryError.prototype = Object.create(Exception.prototype);
    MemoryError.__class__ = new types.Type('MemoryError', [Exception]);
    MemoryError.prototype.__class__ = MemoryError.__class__;
    exceptions['MemoryError'] = MemoryError;

    function NameError(msg) {
        Exception.call(this, 'NameError', msg);
    }
    NameError.prototype = Object.create(Exception.prototype);
    NameError.__class__ = new types.Type('NameError', [Exception]);
    NameError.prototype.__class__ = NameError.__class__;
    exceptions['NameError'] = NameError;

    function NotImplementedException(msg) {
        Exception.call(this, 'NotImplementedException', msg);
    }
    NotImplementedException.prototype = Object.create(Exception.prototype);
    NotImplementedException.__class__ = new types.Type('NotImplementedException', [Exception]);
    NotImplementedException.prototype.__class__ = NotImplementedException.__class__;
    exceptions['NotImplementedException'] = NotImplementedException;

    function NotImplementedError(msg) {
        Exception.call(this, 'NotImplementedError', msg);
    }
    NotImplementedError.prototype = Object.create(Exception.prototype);
    NotImplementedError.__class__ = new types.Type('NotImplementedError', [Exception]);
    NotImplementedError.prototype.__class__ = NotImplementedError.__class__;
    exceptions['NotImplementedError'] = NotImplementedError;

    function OSError(msg) {
        Exception.call(this, 'OSError', msg);
    }
    OSError.prototype = Object.create(Exception.prototype);
    OSError.__class__ = new types.Type('OSError', [Exception]);
    OSError.prototype.__class__ = OSError.__class__;
    exceptions['OSError'] = OSError;

    function OverflowError(msg) {
        Exception.call(this, 'OverflowError', msg);
    }
    OverflowError.prototype = Object.create(Exception.prototype);
    OverflowError.__class__ = new types.Type('OverflowError', [Exception]);
    OverflowError.prototype.__class__ = OverflowError.__class__;
    exceptions['OverflowError'] = OverflowError;

    PendingDeprecationWarning = undefined;

    function PolyglotError(msg) {
        Exception.call(this, 'PolyglotError', msg);
    }
    PolyglotError.prototype = Object.create(Exception.prototype);
    PolyglotError.__class__ = new types.Type('PolyglotError', [Exception]);
    PolyglotError.prototype.__class__ = PolyglotError.__class__;
    exceptions['PolyglotError'] = PolyglotError;

    function ReferenceError(msg) {
        Exception.call(this, 'ReferenceError', msg);
    }
    ReferenceError.prototype = Object.create(Exception.prototype);
    ReferenceError.__class__ = new types.Type('ReferenceError', [Exception]);
    ReferenceError.prototype.__class__ = ReferenceError.__class__;
    exceptions['ReferenceError'] = ReferenceError;

    function RuntimeError(msg) {
        Exception.call(this, 'RuntimeError', msg);
    }
    RuntimeError.prototype = Object.create(Exception.prototype);
    RuntimeError.__class__ = new types.Type('RuntimeError', [Exception]);
    RuntimeError.prototype.__class__ = RuntimeError.__class__;
    exceptions['RuntimeError'] = RuntimeError;

    RuntimeWarning = undefined;

    function StandardError(msg) {
        Exception.call(this, 'StandardError', msg);
    }
    StandardError.prototype = Object.create(Exception.prototype);
    StandardError.__class__ = new types.Type('StandardError', [Exception]);
    StandardError.prototype.__class__ = StandardError.__class__;
    exceptions['StandardError'] = StandardError;

    function StopIteration(msg) {
        Exception.call(this, 'StopIteration', msg);
    }
    StopIteration.prototype = Object.create(Exception.prototype);
    StopIteration.__class__ = new types.Type('StopIteration', [Exception]);
    StopIteration.prototype.__class__ = StopIteration.__class__;
    exceptions['StopIteration'] = StopIteration;

    function SyntaxError(msg) {
        Exception.call(this, 'SyntaxError', msg);
    }
    SyntaxError.prototype = Object.create(Exception.prototype);
    SyntaxError.__class__ = new types.Type('SyntaxError', [Exception]);
    SyntaxError.prototype.__class__ = SyntaxError.__class__;
    exceptions['SyntaxError'] = SyntaxError;

    SyntaxWarning = undefined;

    function SystemError(msg) {
        Exception.call(this, 'SystemError', msg);
    }
    SystemError.prototype = Object.create(Exception.prototype);
    SystemError.__class__ = new types.Type('SystemError', [Exception]);
    SystemError.prototype.__class__ = SystemError.__class__;
    exceptions['SystemError'] = SystemError;

    function TabError(msg) {
        Exception.call(this, 'TabError', msg);
    }
    TabError.prototype = Object.create(Exception.prototype);
    TabError.__class__ = new types.Type('TabError', [Exception]);
    TabError.prototype.__class__ = TabError.__class__;
    exceptions['TabError'] = TabError;

    function TypeError(msg) {
        Exception.call(this, 'TypeError', msg);
    }
    TypeError.prototype = Object.create(Exception.prototype);
    TypeError.__class__ = new types.Type('TypeError', [Exception]);
    TypeError.prototype.__class__ = TypeError.__class__;
    exceptions['TypeError'] = TypeError;

    function UnboundLocalError(msg) {
        Exception.call(this, 'UnboundLocalError', msg);
    }
    UnboundLocalError.prototype = Object.create(Exception.prototype);
    UnboundLocalError.__class__ = new types.Type('UnboundLocalError', [Exception]);
    UnboundLocalError.prototype.__class__ = UnboundLocalError.__class__;
    exceptions['UnboundLocalError'] = UnboundLocalError;

    function UnicodeDecodeError(msg) {
        Exception.call(this, 'UnicodeDecodeError', msg);
    }
    UnicodeDecodeError.prototype = Object.create(Exception.prototype);
    UnicodeDecodeError.__class__ = new types.Type('UnicodeDecodeError', [Exception]);
    UnicodeDecodeError.prototype.__class__ = UnicodeDecodeError.__class__;
    exceptions['UnicodeDecodeError'] = UnicodeDecodeError;

    function UnicodeEncodeError(msg) {
        Exception.call(this, 'UnicodeEncodeError', msg);
    }
    UnicodeEncodeError.prototype = Object.create(Exception.prototype);
    UnicodeEncodeError.__class__ = new types.Type('UnicodeEncodeError', [Exception]);
    UnicodeEncodeError.prototype.__class__ = UnicodeEncodeError.__class__;
    exceptions['UnicodeEncodeError'] = UnicodeEncodeError;

    function UnicodeError(msg) {
        Exception.call(this, 'UnicodeError', msg);
    }
    UnicodeError.prototype = Object.create(Exception.prototype);
    UnicodeError.__class__ = new types.Type('UnicodeError', [Exception]);
    UnicodeError.prototype.__class__ = UnicodeError.__class__;
    exceptions['UnicodeError'] = UnicodeError;

    function UnicodeTranslateError(msg) {
        Exception.call(this, 'UnicodeTranslateError', msg);
    }
    UnicodeTranslateError.prototype = Object.create(Exception.prototype);
    UnicodeTranslateError.__class__ = new types.Type('UnicodeTranslateError', [Exception]);
    UnicodeTranslateError.prototype.__class__ = UnicodeTranslateError.__class__;
    exceptions['UnicodeTranslateError'] = UnicodeTranslateError;

    UnicodeWarning = undefined;

    UserWarning = undefined;

    function ValueError(msg) {
        Exception.call(this, 'ValueError', msg);
    }
    ValueError.prototype = Object.create(Exception.prototype);
    ValueError.__class__ = new types.Type('ValueError', [Exception]);
    ValueError.prototype.__class__ = ValueError.__class__;
    exceptions['ValueError'] = ValueError;

    Warning = undefined;

    function ZeroDivisionError(msg) {
        Exception.call(this, 'ZeroDivisionError', msg);
    }
    ZeroDivisionError.prototype = Object.create(Exception.prototype);
    ZeroDivisionError.__class__ = new types.Type('ZeroDivisionError', [Exception]);
    ZeroDivisionError.prototype.__class__ = ZeroDivisionError.__class__;
    exceptions['ZeroDivisionError'] = ZeroDivisionError;

    return exceptions;
}();
