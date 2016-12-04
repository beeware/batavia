var Buffer = require('buffer').Buffer;

var constants = require('../core').constants;
var Type = require('../core').Type;
var exceptions = require('../core').exceptions;
var type_name = require('../core').type_name;
var None = require('../core').None;

/*************************************************************************
 * Modify String to behave like a Python String
 *************************************************************************/

var Str = String;

Str.prototype.__class__ = new Type('str');

/**************************************************
 * Type conversions
 **************************************************/

Str.prototype.__bool__ = function() {
    return this.length > 0;
}

Str.prototype.__iter__ = function() {
    return new Str.prototype.StrIterator(this);
}

Str.prototype.__repr__ = function() {
    // we have to replace all non-printable characters
    return "'" + this.toString()
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/\x7F/g, "\\x7f")
        .replace(/[\u0000-\u001F]/g, function (match) {
            var code = match.charCodeAt(0);
            switch (code) {
            case 9:
                return "\\t";
            case 10:
                return "\\n";
            case 13:
                return "\\r";
            default:
                var hex = code.toString(16);
                if (hex.length == 1) {
                  hex = "0" + hex;
                }
                return "\\x" + hex;
            }
        }) + "'";
}

Str.prototype.__str__ = function() {
    return this.toString();
}

/**************************************************
 * Attribute manipulation
 **************************************************/

Str.prototype.__getattr__ = function(attr) {
    if (this[attr] === undefined) {
        throw new exceptions.AttributeError("'str' object has no attribute '" + attr + "'");
    }
    return this[attr];
}

Str.prototype.__setattr__ = function(attr, value) {
    if (this.__proto__[attr] === undefined) {
        throw new exceptions.AttributeError("'str' object has no attribute '" + attr + "'");
    } else {
        throw new exceptions.AttributeError("'str' object attribute '" + attr + "' is read-only");
    }
}



/**************************************************
 * Comparison operators
 **************************************************/

Str.prototype.__lt__ = function(other) {
    var types = require('../types');

    if (other !== None) {
        if (types.isinstance(other, [
                    types.Bool, types.Int, types.Float,
                    types.List, types.Dict, types.Tuple,
                    types.Bytearray, types.Bytes, types.Type,
                    types.Complex, types.NotImplementedType,
                    types.Range, types.Set, types.Slice,
                    types.FrozenSet
                ])) {
            throw new exceptions.TypeError("unorderable types: str() < " + type_name(other) + "()");
        } else {
            return this.valueOf() < other;
        }
    } else {
        throw new exceptions.TypeError("unorderable types: str() < NoneType()");
    }
}

Str.prototype.__le__ = function(other) {
    var types = require('../types');

    if (other !== None) {
        if (types.isinstance(other, [
                    types.Bool, types.Int, types.Float,
                    types.List, types.Dict, types.Tuple,
                    types.Set, types.Bytearray, types.Bytes,
                    types.Type, types.Complex, types.NotImplementedType,
                    types.Range, types.Slice, types.FrozenSet
                ])) {
            throw new exceptions.TypeError("unorderable types: str() <= " + type_name(other) + "()");
        } else {
            return this.valueOf() <= other;
        }
    } else {
        throw new exceptions.TypeError("unorderable types: str() <= NoneType()");
    }
}

Str.prototype.__eq__ = function(other) {
    var types = require('../types');

    if (other !== None) {
        if (types.isinstance(other, [
                    types.Bool, types.Int, types.Float,
                    types.List, types.Dict, types.Tuple
                ])) {
            return false;
        } else {
            return this.valueOf() === other.valueOf();
        }
    } else {
        return false;
    }
}

Str.prototype.__ne__ = function(other) {
    var types = require('../types');

    if (other !== None) {
        if (types.isinstance(other, [
                    types.Bool, types.Int, types.Float,
                    types.List, types.Dict, types.Tuple

                ])) {
            return true;
        } else {
            return this.valueOf() !== other.valueOf();
        }
    } else {
        return true;
    }
}

Str.prototype.__gt__ = function(other) {
    var types = require('../types');

    if (other !== None) {
        if (types.isinstance(other, [
                    types.Bool, types.Int, types.Float,
                    types.List, types.Dict, types.Tuple,
                    types.Set, types.Bytearray, types.Bytes,
                    types.Type, types.Complex,
                    types.NotImplementedType, types.Range,
                    types.Slice, types.FrozenSet
                ])) {
            throw new exceptions.TypeError("unorderable types: str() > " + type_name(other) + "()");
        } else {
            return this.valueOf() > other;
        }
    } else {
        throw new exceptions.TypeError("unorderable types: str() > NoneType()");
    }
}

Str.prototype.__ge__ = function(other) {
    var types = require('../types');

    if (other !== None) {
        if (types.isinstance(other, [
                    types.Bool, types.Int, types.Float,
                    types.List, types.Dict, types.Tuple,
                    types.Set, types.Bytearray, types.Bytes,
                    types.Type, types.Complex, types.NotImplementedType,
                    types.Range, types.Slice, types.FrozenSet

                ])) {
            throw new exceptions.TypeError("unorderable types: str() >= " + type_name(other) + "()");
        } else {
            return this.valueOf() >= other;
        }
    } else {
        throw new exceptions.TypeError("unorderable types: str() >= NoneType()");
    }
}

Str.prototype.__contains__ = function(other) {
    return false;
}

/**************************************************
 * Unary operators
 **************************************************/

Str.prototype.__pos__ = function() {
    throw new exceptions.TypeError("bad operand type for unary +: 'str'");
}

Str.prototype.__neg__ = function() {
    throw new exceptions.TypeError("bad operand type for unary -: 'str'");
}

Str.prototype.__not__ = function() {
    return this.length == 0;
}

Str.prototype.__invert__ = function() {
    throw new exceptions.TypeError("bad operand type for unary ~: 'str'");
}

/**************************************************
 * Binary operators
 **************************************************/

Str.prototype.__pow__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for ** or pow(): 'str' and '"+ type_name(other) + "'");
}

Str.prototype.__div__ = function(other) {
    return this.__truediv__(other);
}

Str.prototype.__floordiv__ = function(other) {
    var types = require('../types');

    if (types.isinstance(other, [types.Complex])){
        throw new exceptions.TypeError("can't take floor of complex number.")
    } else {
        throw new exceptions.TypeError("unsupported operand type(s) for //: 'str' and '" + type_name(other) + "'");
    }
}

Str.prototype.__truediv__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for /: 'str' and '" + type_name(other) + "'");
}

Str.prototype.__mul__ = function(other) {
    var types = require('../types');

    var result;
    if (types.isinstance(other, types.Int)) {
        result = '';
        for (var i = 0; i < other.valueOf(); i++) {
            result += this.valueOf();
        }
        return result;
    } else if (types.isinstance(other, types.Bool)) {
        result = other === true ? this.valueOf() : '';
        return result;
    } else {
        throw new exceptions.TypeError("can't multiply sequence by non-int of type '" + type_name(other) + "'");
    }
}


var _substitute = function(format, args) {
    var types = require('../types');
    var results = [];
    var special_case_types = [
        types.List,
        types.Dict,
        types.Bytes];

    /* This is the general form regex for a sprintf-like string. */
    var re = /\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijosuxX])/g;
    var match;
    var lastIndex = 0;
    for (var i = 0; i < args.length; i++) {
        var arg = args[i];

        match = re.exec(format);
        if (match) {
            switch (match[8]) {
                case "b":
                    arg = arg.toString(2);
                break;
                case "c":
                    arg = String.fromCharCode(arg);
                break;
                case "d":
                case "i":
                    arg = parseInt(arg, 10);
                break;
                case "j":
                    arg = JSON.stringify(arg, null, match[6] ? parseInt(match[6], 10) : 0);
                break;
                case "e":
                    arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential();
                break;
                case "f":
                    arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg);
                break;
                case "g":
                    arg = match[7] ? parseFloat(arg).toPrecision(match[7]) : parseFloat(arg);
                break;
                case "o":
                    arg = arg.toString(8);
                break;
                case "s":
                    arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg);
                break;
                case "u":
                    arg = arg >>> 0;
                break;
                case "x":
                    arg = arg.toString(16);
                break;
                case "X":
                    arg = arg.toString(16).toUpperCase();
                break;
            }

            results.push(format.slice(lastIndex, match.index));
            lastIndex = re.lastIndex;
            results.push(arg);
        } else if (    (args.constructor === Array)
                    && types.isinstance(args[0], special_case_types)) {
            return format;
        } else {
            throw new exceptions.TypeError('not all arguments converted during string formatting');
        }
    }

    // Push the rest of the string.
    results.push(format.slice(re.lastIndex));

    if (re.exec(format)){
        // more matches were found!
        throw new exceptions.TypeError('not enough arguments for format string');
    } else {
        return results.join('');
    }
}

Str.prototype.__mod__ = function(other) {
    var types = require('../types');

    if (types.isinstance(other, types.Tuple)) {
        return _substitute(this, other);
    } else {
        return _substitute(this, [other]);
    }
}

Str.prototype.__add__ = function(other) {
    var types = require('../types');

    if (types.isinstance(other, Str)) {
        return this.valueOf() + other.valueOf();
    } else {
        throw new exceptions.TypeError("Can't convert '" + type_name(other) + "' object to str implicitly");
    }
}

Str.prototype.__sub__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for -: 'str' and '" + type_name(other) + "'");
}

Str.prototype.__getitem__ = function(index) {
    var types = require('../types');

    if (types.isinstance(index, types.Bool)) {
        index = index.__int__();
    }
    if (types.isinstance(index, types.Int)) {
        var idx = index.int32();
        if (idx < 0) {
            if (-idx > this.length) {
                throw new exceptions.IndexError("string index out of range");
            } else {
                return this[this.length + idx];
            }
        } else {
            if (idx >= this.length) {
                throw new exceptions.IndexError("string index out of range");
            } else {
                return this[idx];
            }
        }
    } else if (types.isinstance(index, types.Slice)) {
        var start, stop, step;
        start = index.start === null ? undefined : index.start.valueOf();
        stop = index.stop === null ? undefined : index.stop.valueOf();
        step = index.step.valueOf();

        if (step === 0) {
            throw new exceptions.ValueError("slice step cannot be zero");
        }

        // clone string
        var result = this.valueOf();

        // handle step
        if (step === undefined || step === 1) {
            return result.slice(start, stop);
        } else if (step > 0) {
            result = result.slice(start, stop);
        } else if (step < 0) {
            // adjust start/stop to swap inclusion/exlusion in slice
            if (start !== undefined && start !== -1) {
                start = start + 1;
            } else if (start === -1) {
                start = result.length;
            }
            if (stop !== undefined && stop !== -1) {
                stop = stop + 1;
            } else if (stop === -1) {
                stop = result.length;
            }

            result = result.slice(stop, start).split('').reverse().join('');
        }

        var steppedResult = "";
        for (var i = 0; i < result.length; i = i + Math.abs(step)) {
            steppedResult += result[i];
        }

        result = steppedResult;

        return result;
    } else {
        throw new exceptions.TypeError("string indices must be integers");
    }
}

Str.prototype.__lshift__ = function(other) {
    throw new exceptions.TypeError(
        "unsupported operand type(s) for <<: 'str' and '" + type_name(other) + "'"
    );
}

Str.prototype.__rshift__ = function(other) {
    throw new exceptions.TypeError(
        "unsupported operand type(s) for >>: 'str' and '" + type_name(other) + "'"
    );
}

Str.prototype.__and__ = function(other) {
    throw new exceptions.TypeError(
        "unsupported operand type(s) for &: 'str' and '" + type_name(other) + "'"
    );
}

Str.prototype.__xor__ = function(other) {
    throw new exceptions.TypeError(
        "unsupported operand type(s) for ^: 'str' and '" + type_name(other) + "'"
    );
}

Str.prototype.__or__ = function(other) {
    throw new exceptions.TypeError(
        "unsupported operand type(s) for |: 'str' and '" + type_name(other) + "'"
    );
}

/**************************************************
 * Inplace operators
 **************************************************/

Str.prototype.__ifloordiv__ = function(other) {
    var types = require('../types');

    if (types.isinstance(other, [types.Complex])){
        throw new exceptions.TypeError("can't take floor of complex number.")
    } else {
        throw new exceptions.TypeError("unsupported operand type(s) for //=: 'str' and '" + type_name(other) + "'");
    }
}

Str.prototype.__itruediv__ = function(other) {

    throw new exceptions.TypeError("unsupported operand type(s) for /=: 'str' and '" + type_name(other) + "'");
}

Str.prototype.__iadd__ = function(other) {
    var types = require('../types');

    if (types.isinstance(other, Str)) {
        return this.valueOf() + other.valueOf();
    } else {
        throw new exceptions.TypeError("Can't convert '" + type_name(other) + "' object to str implicitly");
    }
}

Str.prototype.__isub__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for -=: 'str' and '" + type_name(other) + "'");
}

Str.prototype.__imul__ = function(other) {
    return this.__mul__(other);
};

Str.prototype.__imod__ = function(other) {
    var types = require('../types');

    if (types.isinstance(other, [
            types.Bool,
            types.Float,
            types.FrozenSet,
            types.Int,
            types.NoneType,
            types.Set,
            Str,
            types.Tuple
        ])) {
        throw new exceptions.TypeError("not all arguments converted during string formatting");
    } else {
        throw new exceptions.NotImplementedError("str.__imod__ has not been implemented");
    }
}

Str.prototype.__ipow__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for ** or pow(): 'str' and '" + type_name(other) + "'");
};

Str.prototype.__ilshift__ = function(other) {
    throw new exceptions.TypeError(
        "unsupported operand type(s) for <<=: 'str' and '" + type_name(other) + "'"
    )
}

Str.prototype.__irshift__ = function(other) {


    throw new exceptions.TypeError("unsupported operand type(s) for >>=: 'str' and '" + type_name(other) + "'");
}

Str.prototype.__iand__ = function(other) {

    throw new exceptions.TypeError("unsupported operand type(s) for &=: 'str' and '" + type_name(other) + "'");
};

Str.prototype.__ixor__ = function(other) {

    throw new exceptions.TypeError("unsupported operand type(s) for ^=: 'str' and '" + type_name(other) + "'");
}

Str.prototype.__ior__ = function(other) {
    throw new exceptions.TypeError("unsupported operand type(s) for |=: 'str' and '" + type_name(other) + "'");
};

/**************************************************
 * Methods
 **************************************************/

Str.prototype.join = function(iter) {
    var types = require('../types');

    var l = new types.List(iter);
    for (var i = 0; i < l.length; i++) {
        if (!types.isinstance(l[i], Str)) {
            throw new exceptions.TypeError("sequence item " + i + ": expected str instance, " + type_name(l[i]) + " found");
        }
    }
    return l.join(this);
}

/**************************************************
 * Str Iterator
 **************************************************/

Str.prototype.StrIterator = function (data) {
    Object.call(this);
    this.index = 0;
    this.data = data;
}

Str.prototype.StrIterator.prototype = Object.create(Object.prototype);

Str.prototype.StrIterator.prototype.__next__ = function() {
    var retval = this.data[this.index];
    if (retval === undefined) {
        throw new exceptions.StopIteration();
    }
    this.index++;
    return retval;
}

Str.prototype.StrIterator.prototype.__str__ = function() {
    return "<str_iterator object at 0x99999999>";
}

/**************************************************
 * Methods
 **************************************************/

Str.prototype.copy = function() {
    return this.valueOf();
}

Str.prototype.encode = function(encoding, errors) {
    var types = require('../types');

    if (errors !== undefined) {
        return new exceptions.NotImplementedError(
            "'errors' parameter of str.encode not implemented"
        );
    }
    encoding = encoding.toLowerCase();
    var encs = constants.TEXT_ENCODINGS;
    if (encs.ascii.indexOf(encoding) !== -1) {
        return new types.Bytes(
            Buffer.from(this.valueOf(), 'ascii'));
    } else if (encs.latin_1.indexOf(encoding) !== -1) {
        return new types.Bytes(
            Buffer.from(this.valueOf(), 'latin1'));
    } else if (encs.utf_8.indexOf(encoding) !== -1) {
        return new types.Bytes(
            Buffer.from(this.valueOf(), 'utf8'));
    } else {
        return new exceptions.NotImplementedError(
            "encoding not implemented or incorrect encoding"
        );
    }
}

Str.prototype.startswith = function (str) {
    var types = require('../types');

    if (str !== None) {
        if (types.isinstance(str, [types.Str])) {
            return this.slice(0, str.length) === str;
        } else {
            throw new exceptions.TypeError(
                "TypeError: startswith first arg must be str or a tuple of str, not " + type_name(str)
            );
        }
    }
}

Str.prototype.endswith = function (str) {
    return this.slice(this.length - str.length) === str;
}

// Based on https://en.wikipedia.org/wiki/Universal_hashing#Hashing_strings
// and http://www.cse.yorku.ca/~oz/hash.html.
//
// CPython returns signed 64-bit integers. But, JS is awful at 64-bit integers,
// so we return signed 32-bit integers. This shouldn't be a problem, since
// technically we can just return 0 and everything should still work :P
Str.prototype.__hash__ = function() {
    var types = require('../types');

    // |0 is used to ensure that we return signed 32-bit integers
    var h = 5381|0;
    for (var i = 0; i < this.length; i++) {
        h = ((h * 33)|0) ^ this[i];
    }
    return new types.Int(h);
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = Str;
