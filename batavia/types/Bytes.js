var constants = require('../core').constants;
var PyObject = require('../core').Object;
var Type = require('../core').Type;
var exceptions = require('../core').exceptions;
var type_name = require('../core').type_name;

/*************************************************************************
 * A Python bytes type
 *************************************************************************/

function Bytes(val) {
    // the value is an instance of Feross's Buffer class
    PyObject.call(this);
    this.val = val;
}

Bytes.prototype = Object.create(PyObject.prototype);
Bytes.prototype.__class__ = new Type('bytes');

/**************************************************
 * Javascript compatibility methods
 **************************************************/

Bytes.prototype.toString = function () {
    return this.__str__();
};

Bytes.prototype.valueOf = function() {
    return this.val;
};

/**************************************************
 * Type conversions
 **************************************************/

Bytes.prototype.__bool__ = function() {
    return this.val.length > 0;
};

Bytes.prototype.__len__ = function () {
    var types = require('../types');
    return new types.Int(this.val.length);
};

Bytes.prototype.__repr__ = function() {
    return this.__str__();
};

Bytes.prototype.__str__ = function() {
    // we iterate natively in JS so as not to have to box/unbox
    // the values from a Batavia Int, maybe premature optimisation
    // when writing only one bytestring to a console/textarea
    // but can't hurt when writing a lot of bytestrings on a socket
    var stringified = "b'";
    // var buffer_length = this.val.length
    var buffer_length = this.__len__();
    for (var i = 0; i < buffer_length; i++) {
        var value = this.val[i];
        if (value >= 32 && value <= 126) {
            stringified += String.fromCharCode(value);
        } else if (value >= 9 && value <= 13) {
            stringified += {
                9  : "\\t",
                10 : "\\n",
                11 : "\\x0b",
                12 : "\\x0c",
                13 : "\\r"
            }[value];
        } else {
            stringified += "\\x" + ("0" + value.toString(16)).slice(-2);
        }
    }
    return stringified + "'";
};

Bytes.prototype.__iter__ = function() {
    return new Bytes.prototype.BytesIterator(this.val);
};

/**************************************************
 * Comparison operators
 **************************************************/

Bytes.prototype.__lt__ = function(other) {
    var types = require('../types');

    if (types.isinstance(other, Bytes)) {
        return this.val < other.val;
    } else {
        throw new exceptions.TypeError.$pyclass("unorderable types: bytes() < " + type_name(other) + "()");
    }
};

Bytes.prototype.__le__ = function(other) {
    var types = require('../types');

    if (types.isinstance(other, Bytes)) {
        return this.val <= other.val;
    } else {
        throw new exceptions.TypeError.$pyclass("unorderable types: bytes() <= " + type_name(other) + "()");
    }
};

Bytes.prototype.__eq__ = function(other) {
    var types = require('../types');

    if (types.isinstance(other, Bytes)) {
        var equal = (this.val.compare(other.val) == 0);
        return new types.Bool(equal);
    } else if (types.isinstance (other, types.Bytearray)) {
        throw new exceptions.NotImplementedError.$pyclass(
            "Comparison between bytes and bytearrays has not been implemented");
    } else {
        return new types.Bool(false);
    }
};

Bytes.prototype.__ne__ = function(other) {
    return this.__eq__(other).__not__();
};

Bytes.prototype.__gt__ = function(other) {
    var types = require('../types');

    if (types.isinstance(other, Bytes)) {
        return this.val > other.val;
    } else {
        throw new exceptions.TypeError.$pyclass("unorderable types: bytes() > " + type_name(other) + "()");
    }
};

Bytes.prototype.__ge__ = function(other) {
    var types = require('../types');

    if (types.isinstance(other, Bytes)) {
        return this.val >= other.val;
    } else {
        throw new exceptions.TypeError.$pyclass("unorderable types: bytes() >= " + type_name(other) + "()");
    }
};

Bytes.prototype.__contains__ = function(other) {
    var types = require('../types');

    var other_value = null;
    if (types.isinstance(other, types.Int)) {
        if (other >= 0 && other <= 255) {
            other_value = parseInt(other.valueOf());
        } else {
            throw new exceptions.ValueError.$pyclass(
                "byte must be in range (0, 256)"
            );
        }
    } else if (types.isinstance(other, Bytes)) {
        other_value = this.val;
    }
    if (other_value !== null) {
        return this.val.indexOf(other_value) !== -1;
    } else {
        return new types.Bool(false);
    }
};

/**************************************************
 * Unary operators
 **************************************************/

Bytes.prototype.__pos__ = function() {
    return new Bytes(+this.valueOf());
};

Bytes.prototype.__neg__ = function() {
    return new Bytes(-this.valueOf());
};

Bytes.prototype.__not__ = function() {
    return new Bytes(!this.valueOf());
};

Bytes.prototype.__invert__ = function() {
    return new Bytes(~this.valueOf());
};

/**************************************************
 * Binary operators
 **************************************************/

Bytes.prototype.__pow__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass("Bytes.__pow__ has not been implemented");
};

Bytes.prototype.__div__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass("Bytes.__div__ has not been implemented");
};

Bytes.prototype.__floordiv__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass("Bytes.__floordiv__ has not been implemented");
};

Bytes.prototype.__truediv__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass("Bytes.__truediv__ has not been implemented");
};

Bytes.prototype.__mul__ = function(other) {
    throw new exceptions.TypeError.$pyclass("can't multiply sequence by non-int of type '" + type_name(other) + "'");
};

Bytes.prototype.__mod__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass("Bytes.__mod__ has not been implemented");
};

Bytes.prototype.__add__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass("Bytes.__add__ has not been implemented");
};

Bytes.prototype.__sub__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass("Bytes.__sub__ has not been implemented");
};

Bytes.prototype.__getitem__ = function(other) {
    var types = require('../types');
    var builtins = require('../builtins');

    return new types.Int(this.val[builtins.int(other).valueOf()]);
};

Bytes.prototype.__lshift__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass("Bytes.__lshift__ has not been implemented");
};

Bytes.prototype.__rshift__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass("Bytes.__rshift__ has not been implemented");
};

Bytes.prototype.__and__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass("Bytes.__and__ has not been implemented");
};

Bytes.prototype.__xor__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass("Bytes.__xor__ has not been implemented");
};

Bytes.prototype.__or__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass("Bytes.__or__ has not been implemented");
};

/**************************************************
 * Inplace operators
 **************************************************/

Bytes.prototype.__ifloordiv__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass("Bytes.__ifloordiv__ has not been implemented");
};

Bytes.prototype.__itruediv__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass("Bytes.__itruediv__ has not been implemented");
};

Bytes.prototype.__iadd__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass("Bytes.__iadd__ has not been implemented");
};

Bytes.prototype.__isub__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass("Bytes.__isub__ has not been implemented");
};

Bytes.prototype.__imul__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass("Bytes.__imul__ has not been implemented");
};

Bytes.prototype.__imod__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass("Bytes.__imod__ has not been implemented");
};

Bytes.prototype.__ipow__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass("Bytes.__ipow__ has not been implemented");
};

Bytes.prototype.__ilshift__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass("Bytes.__ilshift__ has not been implemented");
};

Bytes.prototype.__irshift__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass("Bytes.__irshift__ has not been implemented");
};

Bytes.prototype.__iand__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass("Bytes.__iand__ has not been implemented");
};

Bytes.prototype.__ixor__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass("Bytes.__ixor__ has not been implemented");
};

Bytes.prototype.__ior__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass("Bytes.__ior__ has not been implemented");
};

/**************************************************
 * Methods
 **************************************************/

Bytes.prototype.copy = function() {
    return new Bytes(this.valueOf());
};

Bytes.prototype.decode = function(encoding, errors) {
    if (errors !== undefined) {
        return new exceptions.NotImplementedError(
            "'errors' parameter of String.encode not implemented"
        );
    }
    encoding = encoding.toLowerCase();
    var encs = constants.TEXT_ENCODINGS;
    if (encs.ascii.indexOf(encoding) !== -1) {
        return this.val.toString('ascii');
    } else if (encs.latin_1.indexOf(encoding) !== -1) {
        return this.val.toString('latin1');
    } else if (encs.utf_8.indexOf(encoding) !== -1) {
        return this.val.toString('utf8');
    } else {
        return new exceptions.NotImplementedError(
            "encoding not implemented or incorrect encoding"
        );
    }
};

/**************************************************
 * Bytes Iterator
 **************************************************/

Bytes.prototype.BytesIterator = function(data) {
    PyObject.call(this);
    this.index = 0;
    this.data = data;
};

Bytes.prototype.BytesIterator.prototype = Object.create(PyObject.prototype);
Bytes.prototype.BytesIterator.prototype.__class__ = new Type('bytes_iterator');

Bytes.prototype.BytesIterator.prototype.__iter__ = function() {
    return this;
};

Bytes.prototype.BytesIterator.prototype.__next__ = function() {
    var types = require('../types');

    if (this.index >= this.data.length) {
        throw new exceptions.StopIteration.$pyclass();
    }
    var retval = this.data[this.index];
    this.index++;
    return new types.Int(retval);
};

Bytes.prototype.BytesIterator.prototype.__str__ = function() {
    return "<bytes_iterator object at 0x99999999>";
};

/**************************************************
 * Module exports
 **************************************************/

module.exports = Bytes;
