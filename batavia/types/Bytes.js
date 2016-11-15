/*************************************************************************
 * A Python bytes type
 *************************************************************************/
var types = require('./Type');


module.exports = function() {
    var utils = require('../utils');

    function Bytes(val) {
        // the value is an instance of Feross's Buffer class
        types.Object.call(this);
        this.val = val;
    }

    Bytes.prototype = Object.create(types.Object.prototype);
    Bytes.prototype.__class__ = new types.Type('bytes');

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
        return new batavia.types.Int(this.val.length);
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
        if (utils.isinstance(other, batavia.types.Bytes)) {
            return this.val < other.val;
        } else {
            throw new batavia.builtins.TypeError("unorderable types: bytes() < " + utils.type_name(other) + "()");
        }
    };

    Bytes.prototype.__le__ = function(other) {
        if (utils.isinstance(other, batavia.types.Bytes)) {
            return this.val <= other.val;
        } else {
            throw new batavia.builtins.TypeError("unorderable types: bytes() <= " + utils.type_name(other) + "()");
        }
    };

    Bytes.prototype.__eq__ = function(other) {
        if (utils.isinstance(other, batavia.types.Bytes)) {
            var equal = (this.val.compare(other.val) == 0);
            return new batavia.types.Bool(equal);
        } else if (utils.isinstance (other, batavia.types.Bytearray)) {
            throw new batavia.builtins.NotImplementedError(
                "Comparison between bytes and bytearrays has not been implemented");
        } else {
            return new batavia.types.Bool(false);
        }
    };

    Bytes.prototype.__ne__ = function(other) {
        return this.__eq__(other).__not__();
    };

    Bytes.prototype.__gt__ = function(other) {
        if (utils.isinstance(other, batavia.types.Bytes)) {
            return this.val > other.val;
        } else {
            throw new batavia.builtins.TypeError("unorderable types: bytes() > " + utils.type_name(other) + "()");
        }
    };

    Bytes.prototype.__ge__ = function(other) {
        if (utils.isinstance(other, batavia.types.Bytes)) {
            return this.val >= other.val;
        } else {
            throw new batavia.builtins.TypeError("unorderable types: bytes() >= " + utils.type_name(other) + "()");
        }
    };

    Bytes.prototype.__contains__ = function(other) {
        var other_value = null;
        if (utils.isinstance(other, batavia.types.Int)) {
            if (other >= 0 && other <= 255) {
                other_value = parseInt(other.valueOf());
            } else {
                throw new batavia.builtins.ValueError(
                    "byte must be in range (0, 256)"
                );
            }
        } else if (utils.isinstance(other, batavia.types.Bytes)) {
            other_value = this.val;
        }
        if (other_value !== null) {
            return this.val.indexOf(other_value) !== -1;
        } else {
            return new batavia.types.Bool(false);
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
        throw new batavia.builtins.NotImplementedError("Bytes.__pow__ has not been implemented");
    };

    Bytes.prototype.__div__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__div__ has not been implemented");
    };

    Bytes.prototype.__floordiv__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__floordiv__ has not been implemented");
    };

    Bytes.prototype.__truediv__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__truediv__ has not been implemented");
    };

    Bytes.prototype.__mul__ = function(other) {
        throw new batavia.builtins.TypeError("can't multiply sequence by non-int of type '" + utils.type_name(other) + "'");
    };

    Bytes.prototype.__mod__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__mod__ has not been implemented");
    };

    Bytes.prototype.__add__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__add__ has not been implemented");
    };

    Bytes.prototype.__sub__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__sub__ has not been implemented");
    };

    Bytes.prototype.__getitem__ = function(other) {
        return new batavia.types.Int(this.val[batavia.builtins.int(other).valueOf()]);
    };

    Bytes.prototype.__lshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__lshift__ has not been implemented");
    };

    Bytes.prototype.__rshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__rshift__ has not been implemented");
    };

    Bytes.prototype.__and__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__and__ has not been implemented");
    };

    Bytes.prototype.__xor__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__xor__ has not been implemented");
    };

    Bytes.prototype.__or__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__or__ has not been implemented");
    };

    /**************************************************
     * Inplace operators
     **************************************************/

    Bytes.prototype.__ifloordiv__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__ifloordiv__ has not been implemented");
    };

    Bytes.prototype.__itruediv__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__itruediv__ has not been implemented");
    };

    Bytes.prototype.__iadd__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__iadd__ has not been implemented");
    };

    Bytes.prototype.__isub__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__isub__ has not been implemented");
    };

    Bytes.prototype.__imul__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__imul__ has not been implemented");
    };

    Bytes.prototype.__imod__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__imod__ has not been implemented");
    };

    Bytes.prototype.__ipow__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__ipow__ has not been implemented");
    };

    Bytes.prototype.__ilshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__ilshift__ has not been implemented");
    };

    Bytes.prototype.__irshift__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__irshift__ has not been implemented");
    };

    Bytes.prototype.__iand__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__iand__ has not been implemented");
    };

    Bytes.prototype.__ixor__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__ixor__ has not been implemented");
    };

    Bytes.prototype.__ior__ = function(other) {
        throw new batavia.builtins.NotImplementedError("Bytes.__ior__ has not been implemented");
    };

    /**************************************************
     * Methods
     **************************************************/

    Bytes.prototype.copy = function() {
        return new Bytes(this.valueOf());
    };

    Bytes.prototype.decode = function(encoding, errors) {
        if (errors !== undefined) {
            return new batavia.builtins.NotImplementedError(
                "'errors' parameter of String.encode not implemented"
            );
        }
        encoding = encoding.toLowerCase();
        var encs = batavia.TEXT_ENCODINGS;
        if (encs.ascii.indexOf(encoding) !== -1) {
            return this.val.toString('ascii');
        } else if (encs.latin_1.indexOf(encoding) !== -1) {
            return this.val.toString('latin1');
        } else if (encs.utf_8.indexOf(encoding) !== -1) {
            return this.val.toString('utf8');
        } else {
            return new batavia.builtins.NotImplementedError(
                "encoding not implemented or incorrect encoding"
            );
        }
    };

    /**************************************************
     * Bytes Iterator
     **************************************************/

    Bytes.prototype.BytesIterator = function(data) {
        Object.call(this);
        this.index = 0;
        this.data = data;
    };

    Bytes.prototype.BytesIterator.prototype = Object.create(Object.prototype);

    Bytes.prototype.BytesIterator.prototype.__iter__ = function() {
        return this;
    };

    Bytes.prototype.BytesIterator.prototype.__next__ = function() {
        if (this.index >= this.data.length) {
            throw new batavia.builtins.StopIteration();
        }
        var retval = this.data[this.index];
        this.index++;
        return new batavia.types.Int(retval);
    };

    Bytes.prototype.BytesIterator.prototype.__str__ = function() {
        return "<bytes_iterator object at 0x99999999>";
    };

    Bytes.prototype.BytesIterator.prototype.constructor = Bytes.prototype.BytesIterator;
    Bytes.prototype.BytesIterator.prototype.__class__ = new types.Type('bytes_iterator');

    /**************************************************/

    return Bytes;
}();
