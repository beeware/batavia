
/*************************************************************************
 * Modify String to behave like a Python String
 *************************************************************************/

batavia.types.Str = String;
String.prototype.__class__ = new batavia.types.Type('str');

/**************************************************
 * Type conversions
 **************************************************/

String.prototype.__iter__ = function() {
    return new String.prototype.StrIterator(this);
};

String.prototype.__repr__ = function() {
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
};

String.prototype.__str__ = function() {
    return this.toString();
};

/**************************************************
 * Comparison operators
 **************************************************/

String.prototype.__lt__ = function(other) {
    if (other !== null) {
        if (batavia.isinstance(other, [
                    batavia.types.Bool, batavia.types.Int, batavia.types.Float,
                    batavia.types.List, batavia.types.Dict, batavia.types.Tuple,
                    batavia.types.Bytearray, batavia.types.Bytes, batavia.types.Type,
                    batavia.types.Complex, batavia.types.NotImplementedType,
                    batavia.types.Range, batavia.types.Set, batavia.types.Slice
                ])) {
            throw new batavia.builtins.TypeError("unorderable types: str() < " + batavia.type_name(other) + "()");
        } else {
            return this.valueOf() < other;
        }
    } else {
        throw new batavia.builtins.TypeError("unorderable types: str() < NoneType()");
    }
};

String.prototype.__le__ = function(other) {
    if (other !== null) {
        if (batavia.isinstance(other, [
                    batavia.types.Bool, batavia.types.Int, batavia.types.Float,
                    batavia.types.List, batavia.types.Dict, batavia.types.Tuple,
                    batavia.types.Set, batavia.types.Bytearray, batavia.types.Bytes,
                    batavia.types.Type, batavia.types.Complex, batavia.types.NotImplementedType,
                    batavia.types.Range, batavia.types.Slice
                ])) {
            throw new batavia.builtins.TypeError("unorderable types: str() <= " + batavia.type_name(other) + "()");
        } else {
            return this.valueOf() <= other;
        }
    } else {
        throw new batavia.builtins.TypeError("unorderable types: str() <= NoneType()");
    }
};

String.prototype.__eq__ = function(other) {
    if (other !== null) {
        if (batavia.isinstance(other, [
                    batavia.types.Bool, batavia.types.Int, batavia.types.Float,
                    batavia.types.List, batavia.types.Dict, batavia.types.Tuple
                ])) {
            return false;
        } else {
            return this.valueOf() === other.valueOf();
        }
    } else {
        return false;
    }
};

String.prototype.__ne__ = function(other) {
    if (other !== null) {
        if (batavia.isinstance(other, [
                    batavia.types.Bool, batavia.types.Int, batavia.types.Float,
                    batavia.types.List, batavia.types.Dict, batavia.types.Tuple
                ])) {
            return true;
        } else {
            return this.valueOf() !== other.valueOf();
        }
    } else {
        return true;
    }
};

String.prototype.__gt__ = function(other) {
    if (other !== null) {
        if (batavia.isinstance(other, [
                    batavia.types.Bool, batavia.types.Int, batavia.types.Float,
                    batavia.types.List, batavia.types.Dict, batavia.types.Tuple,
                    batavia.types.Set, batavia.types.Bytearray, batavia.types.Bytes,
                    batavia.types.Type, batavia.types.Complex,
                    batavia.types.NotImplementedType, batavia.types.Range,
                    batavia.types.Slice
                ])) {
            throw new batavia.builtins.TypeError("unorderable types: str() > " + batavia.type_name(other) + "()");
        } else {
            return this.valueOf() > other;
        }
    } else {
        throw new batavia.builtins.TypeError("unorderable types: str() > NoneType()");
    }
};

String.prototype.__ge__ = function(other) {
    if (other !== null) {
        if (batavia.isinstance(other, [
                    batavia.types.Bool, batavia.types.Int, batavia.types.Float,
                    batavia.types.List, batavia.types.Dict, batavia.types.Tuple,
                    batavia.types.Set, batavia.types.Bytearray, batavia.types.Bytes,
                    batavia.types.Type, batavia.types.Complex, batavia.types.NotImplementedType,
                    batavia.types.Range, batavia.types.Slice

                ])) {
            throw new batavia.builtins.TypeError("unorderable types: str() >= " + batavia.type_name(other) + "()");
        } else {
            return this.valueOf() >= other;
        }
    } else {
        throw new batavia.builtins.TypeError("unorderable types: str() >= NoneType()");
    }
};

String.prototype.__contains__ = function(other) {
    return false;
};

/**************************************************
 * Unary operators
 **************************************************/

String.prototype.__pos__ = function() {
    throw new batavia.builtins.TypeError("bad operand type for unary +: 'str'");
};

String.prototype.__neg__ = function() {
    throw new batavia.builtins.TypeError("bad operand type for unary -: 'str'");
};

String.prototype.__not__ = function() {

    return this.length == 0;
};

String.prototype.__invert__ = function() {
    throw new batavia.builtins.TypeError("bad operand type for unary ~: 'str'");
};

/**************************************************
 * Binary operators
 **************************************************/

String.prototype.__pow__ = function(other) {
    throw new batavia.builtins.TypeError("unsupported operand type(s) for ** or pow(): 'str' and '"+ batavia.type_name(other) + "'");
};

String.prototype.__div__ = function(other) {
    return this.__truediv__(other);
};

String.prototype.__floordiv__ = function(other) {
    throw new batavia.builtins.TypeError("unsupported operand type(s) for //: 'str' and '" + batavia.type_name(other) + "'");
};

String.prototype.__truediv__ = function(other) {
    throw new batavia.builtins.TypeError("unsupported operand type(s) for /: 'str' and '" + batavia.type_name(other) + "'");
};

String.prototype.__mul__ = function(other) {
    var result;
    if (batavia.isinstance(other, batavia.types.Int)) {
        result = '';
        for (var i = 0; i < other.valueOf(); i++) {
            result += this.valueOf();
        }
        return result;
    } else if (batavia.isinstance(other, batavia.types.Bool)) {
        result = other === true ? this.valueOf() : '';
        return result;
    } else {
        throw new batavia.builtins.TypeError("can't multiply sequence by non-int of type '" + batavia.type_name(other) + "'");
    }
};

String.prototype.__mod__ = function(other) {
    if (batavia.isinstance(other, batavia.types.Tuple)) {
        return batavia._substitute(this, other);
    } else {
        return batavia._substitute(this, [other]);
    }
};

String.prototype.__add__ = function(other) {
    if (batavia.isinstance(other, batavia.types.Str)) {
        return this.valueOf() + other.valueOf();
    } else {
        throw new batavia.builtins.TypeError("Can't convert '" + batavia.type_name(other) + "' object to str implicitly");
    }
};

String.prototype.__sub__ = function(other) {
    throw new batavia.builtins.TypeError("unsupported operand type(s) for -: 'str' and '" + batavia.type_name(other) + "'");
};

String.prototype.__getitem__ = function(index) {
    if (batavia.isinstance(index, batavia.types.Int)) {
        var idx = index.int32();
        if (idx < 0) {
            if (-idx > this.length) {
                throw new batavia.builtins.IndexError("string index out of range");
            } else {
                return this[this.length + idx];
            }
        } else {
            if (idx >= this.length) {
                throw new batavia.builtins.IndexError("string index out of range");
            } else {
                return this[idx];
            }
        }
    } else if (batavia.isinstance(index, batavia.types.Slice)) {
        var start, stop, step;
        start = index.start === null ? undefined : index.start.valueOf();
        stop = index.stop === null ? undefined : index.stop.valueOf();
        step = index.step.valueOf();

        if (step === 0) {
            throw new batavia.builtins.ValueError("slice step cannot be zero");
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
        throw new batavia.builtins.TypeError("string indices must be integers");
    }
};

String.prototype.__lshift__ = function(other) {
    throw new batavia.builtins.TypeError(
        "unsupported operand type(s) for <<: 'str' and '" + batavia.type_name(other) + "'"
    );
};

String.prototype.__rshift__ = function(other) {
    throw new batavia.builtins.TypeError(
        "unsupported operand type(s) for >>: 'str' and '" + batavia.type_name(other) + "'"
    );
};

String.prototype.__and__ = function(other) {
    throw new batavia.builtins.TypeError(
        "unsupported operand type(s) for &: 'str' and '" + batavia.type_name(other) + "'"
    );
};

String.prototype.__xor__ = function(other) {
    throw new batavia.builtins.TypeError(
        "unsupported operand type(s) for ^: 'str' and '" + batavia.type_name(other) + "'"
    );
};

String.prototype.__or__ = function(other) {
    throw new batavia.builtins.TypeError(
        "unsupported operand type(s) for |: 'str' and '" + batavia.type_name(other) + "'"
    );
};

/**************************************************
 * Inplace operators
 **************************************************/

String.prototype.__ifloordiv__ = function(other) {

    if (batavia.isinstance(other, [batavia.types.Complex])){
        throw new batavia.builtins.TypeError("can't take floor of complex number.")
    } else {
        throw new batavia.builtins.TypeError("unsupported operand type(s) for //=: 'str' and '" + batavia.type_name(other) + "'");
    }
};

String.prototype.__itruediv__ = function(other) {

    throw new batavia.builtins.TypeError("unsupported operand type(s) for /=: 'str' and '" + batavia.type_name(other) + "'");
};

String.prototype.__iadd__ = function(other) {
    if (batavia.isinstance(other, batavia.types.Str)) {
        return this.valueOf() + other.valueOf();
    } else {
        throw new batavia.builtins.TypeError("Can't convert '" + batavia.type_name(other) + "' object to str implicitly");
    }
};

String.prototype.__isub__ = function(other) {
    throw new batavia.builtins.TypeError("unsupported operand type(s) for -=: 'str' and '" + batavia.type_name(other) + "'");
};

String.prototype.__imul__ = function(other) {
    return this.__mul__(other);

};

String.prototype.__imod__ = function(other) {
    if (batavia.isinstance(other, [
            batavia.types.Bool,
            batavia.types.Float,
            batavia.types.FrozenSet,
            batavia.types.Int,
            batavia.types.NoneType,
            batavia.types.Set,
            batavia.types.Str,
            batavia.types.Tuple
        ])) {
        throw new batavia.builtins.TypeError("not all arguments converted during string formatting");
    } else {
        throw new batavia.builtins.NotImplementedError("String.__imod__ has not been implemented");
    }
};

String.prototype.__ipow__ = function(other) {
    throw new batavia.builtins.TypeError("unsupported operand type(s) for ** or pow(): 'str' and '" + batavia.type_name(other) + "'");

};

String.prototype.__ilshift__ = function(other) {
    throw new batavia.builtins.TypeError(
        "unsupported operand type(s) for <<=: 'str' and '" + batavia.type_name(other) + "'"
    )
};

String.prototype.__irshift__ = function(other) {


    throw new batavia.builtins.TypeError("unsupported operand type(s) for >>=: 'str' and '" + batavia.type_name(other) + "'");
};

String.prototype.__iand__ = function(other) {

    throw new batavia.builtins.TypeError("unsupported operand type(s) for &=: 'str' and '" + batavia.type_name(other) + "'");

};

String.prototype.__ixor__ = function(other) {

    throw new batavia.builtins.TypeError("unsupported operand type(s) for ^=: 'str' and '" + batavia.type_name(other) + "'");
};

String.prototype.__ior__ = function(other) {
    throw new batavia.builtins.TypeError("unsupported operand type(s) for |=: 'str' and '" + batavia.type_name(other) + "'");

};

/**************************************************
 * Methods
 **************************************************/

String.prototype.join = function(iter) {
    var l = new batavia.types.List(iter);
    for (var i = 0; i < l.length; i++) {
        if (!batavia.isinstance(l[i], batavia.types.Str)) {
            throw new batavia.builtins.TypeError("sequence item " + i + ": expected str instance, " + batavia.type_name(l[i]) + " found");
        }
    }
    return l.join(this);
};

/**************************************************
 * Str Iterator
 **************************************************/

String.prototype.StrIterator = function (data) {
    Object.call(this);
    this.index = 0;
    this.data = data;
};

String.prototype.StrIterator.prototype = Object.create(Object.prototype);

String.prototype.StrIterator.prototype.__next__ = function() {
    var retval = this.data[this.index];
    if (retval === undefined) {
        throw new batavia.builtins.StopIteration();
    }
    this.index++;
    return retval;
};

String.prototype.StrIterator.prototype.__str__ = function() {
    return "<str_iterator object at 0x99999999>";
};

/**************************************************
 * Methods
 **************************************************/

String.prototype.copy = function() {
    return this.valueOf();
};

String.prototype.startswith = function (str) {
    return this.slice(0, str.length) === str;
};

String.prototype.__setattr__ = function (name, val) {
    if (this.__proto__[name] === undefined) {
        throw new batavia.builtins.AttributeError("'str' object has no attribute '" + name + "'");
    } else {
        throw new batavia.builtins.AttributeError("'str' object attribute '" + name + "' is read-only");
    }
};
