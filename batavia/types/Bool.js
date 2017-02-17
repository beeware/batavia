var Type = require('../core').Type;
var exceptions = require('../core').exceptions;
var type_name = require('../core').type_name;

/*************************************************************************
 * Modify Javascript Boolean to behave like a Python bool
 *************************************************************************/

var Bool = Boolean;

Bool.prototype.__class__ = new Type('bool');
Bool.prototype.__class__.$pyclass = Bool;

/**************************************************
 * Type conversions
 **************************************************/

Bool.prototype.__bool__ = function() {
    return this.valueOf();
}

Bool.prototype.__repr__ = function(args, kwargs) {
    return this.__str__();
}

Bool.prototype.__str__ = function(args, kwargs) {
    if (this.valueOf()) {
        return "True";
    } else {
        return "False";
    }
}

Bool.prototype.__float__ = function() {
    var types = require('../types');

    return new types.Float(this.valueOf() ? 1.0 : 0.0);
}

/**************************************************
 * Comparison operators
 **************************************************/

Bool.prototype.__lt__ = function(other) {
    return this.valueOf() < other;
}

Bool.prototype.__le__ = function(other) {
    return this.valueOf() <= other;
}

Bool.prototype.__eq__ = function(other) {
    return this.valueOf() == other;
}

Bool.prototype.__ne__ = function(other) {
    var types = require('../types');

    if (types.isinstance(other, types.Str)) {
        return Bool(true);
    }
    return this.valueOf() != other;
}

Bool.prototype.__gt__ = function(other) {
    var types = require('../types');

    var invalid_types = [
        types.Bytearray,
        types.Bytes,
        types.Complex,
        types.Dict,
        types.FrozenSet,
        types.List,
        types.NoneType,
        types.NotImplementedType,
        types.Range,
        types.Set,
        types.Slice,
        types.Str,
        types.Tuple,
        types.Type,
    ];

    if (types.isinstance(other, invalid_types)) {
      throw new exceptions.TypeError.$pyclass('unorderable types: bool() > ' + type_name(other) + '()');
    }

    return this.valueOf() > other;
}

Bool.prototype.__ge__ = function(other) {
    return this.valueOf() >= other;
}

Bool.prototype.__contains__ = function(other) {
    return false;
}


/**************************************************
 * Unary operators
 **************************************************/

Bool.prototype.__pos__ = function() {
    return +this.valueOf();
}

Bool.prototype.__neg__ = function() {
    return -this.valueOf();
}

Bool.prototype.__not__ = function() {
    return Bool(!this.valueOf());
}

Bool.prototype.__invert__ = function() {
    return ~this.valueOf();
}

Bool.prototype.__int__ = function() {
    var types = require('../types');

    if (this.valueOf()) {
        return new types.Int(1);
    } else {
        return new types.Int(0);
    }
}

/**************************************************
 * Binary operators
 **************************************************/

Bool.prototype.__pow__ = function(other) {
    var types = require('../types');

    if (types.isinstance(other, Bool)) {
        if (this.valueOf() && other.valueOf()) {
            return new types.Int(1);
        } else if (this.valueOf()) {
            return new types.Int(1);
        } else if (other.valueOf()) {
            return new types.Int(0);
        } else {
            return new types.Int(1);
        }
    } else if (types.isinstance(other, [types.Float, types.Int])) {
        if (this.valueOf()) {
            if (types.isinstance(other, types.Int) && other.__ge__(new types.Float(0.0))) {
                return new types.Int(Math.pow(1, other.valueOf()));
            } else {
                return new types.Float(Math.pow(1.0, other.valueOf()));
            }
        } else {
            if (other.__lt__(new types.Float(0.0))) {
                throw new exceptions.ZeroDivisionError.$pyclass("0.0 cannot be raised to a negative power");
            } else if (types.isinstance(other, types.Int)) {
                return new types.Int(Math.pow(0, other.valueOf()));
            } else {
                return new types.Float(Math.pow(0.0, other.valueOf()));
            }
        }
    } else {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for pow: 'bool' and '" + type_name(other) + "'");
    }
}

Bool.prototype.__div__ = function(other) {
    return this.__truediv__(other);
}

Bool.prototype.__floordiv__ = function(other) {
    var types = require('../types');

    if (types.isinstance(other, Bool)) {
        if (!other.valueOf()) {
            throw new exceptions.ZeroDivisionError.$pyclass("integer division or modulo by zero");
        } else if (this.valueOf() && other.valueOf()) {
            return new types.Int(1);
        } else {
            return new types.Int(0);
        }
    } else if (types.isinstance(other, [types.Float, types.Int])) {
        var thisValue;
        var message = "";

        if (types.isinstance(other, types.Int)) {
            thisValue = this.valueOf() ? 1 : 0;
            message = "integer division or modulo by zero";
        } else {
            thisValue = this.valueOf() ? 1.0 : 0.0;
            message = "float divmod()";
        }

        var roundedVal = Math.floor(thisValue / other);

        if (other === 0) {
            throw new exceptions.ZeroDivisionError.$pyclass(message);
        } else if (types.isinstance(other, types.Int)) {
            return new types.Int(roundedVal);
        } else {
            return new types.Float(roundedVal);
        }
    } else {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for //: 'bool' and '" + type_name(other) + "'");
    }
}

Bool.prototype.__truediv__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for /: 'bool' and '" + type_name(other) + "'");
}

Bool.prototype.__mul__ = function(other) {
    var types = require('../types');

    if (types.isinstance(other, Bool)) {
        if (this.valueOf() && other.valueOf()) {
            return new types.Int(1);
        } else {
            return new types.Int(0);
        }
    } else if (types.isinstance(other, types.Float)) {
        return new types.Float((this.valueOf() ? 1.0 : 0.0) * other.valueOf());
    } else if (types.isinstance(other, types.Int)) {
        return new types.Int((this.valueOf() ? 1 : 0) * other.valueOf());
    } else {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for *: 'bool' and '" + type_name(other) + "'");
    }}

Bool.prototype.__mod__ = function(other) {
    throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for %: 'bool' and '" + type_name(other) + "'");
}

Bool.prototype.__add__ = function(other) {
    var types = require('../types');

    if (types.isinstance(other, Bool)) {
        if (this.valueOf() && other.valueOf()) {
            return new types.Int(2);
        } else if (this.valueOf() || other.valueOf()) {
            return new types.Int(1);
        } else {
            return new types.Int(0);
        }
    } else if (types.isinstance(other, types.Float)) {
        return new types.Float((this.valueOf() ? 1.0 : 0.0) + other.valueOf());
    } else if (types.isinstance(other, types.Int)) {
        return new types.Int(other.val.add(this.valueOf() ? 1 : 0));
    } else {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for +: 'bool' and '" + type_name(other) + "'");
    }
}

Bool.prototype.__sub__ = function(other) {
    var types = require('../types');

    if (types.isinstance(other, Bool)) {
        if (this.valueOf() && other.valueOf()) {
            return new types.Int(0);
        } else if (this.valueOf()) {
            return new types.Int(1);
        } else if (other.valueOf()) {
            return new types.Int(-1);
        } else {
            return new types.Int(0);
        }
    } else if (types.isinstance(other, types.Float)) {
        return new types.Float((this.valueOf() ? 1.0 : 0.0) - other.valueOf());
    } else if (types.isinstance(other, types.Int)) {
        return new types.Int(other.val.sub(this.valueOf() ? 1 : 0).neg());
    } else {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for -: 'bool' and '" + type_name(other) + "'");
    }
}

Bool.prototype.__getitem__ = function(other) {
    throw new exceptions.TypeError.$pyclass("'bool' object is not subscriptable");
}

Bool.prototype.__lshift__ = function(other) {
    var types = require('../types');

    if (types.isinstance(other, Bool)) {
        if (this.valueOf() && other.valueOf()) {
            return new types.Int(2);
        } else if (this.valueOf()) {
            return new types.Int(1);
        } else if (other.valueOf()) {
            return new types.Int(0);
        } else {
            return new types.Int(0);
        }
    } else if (types.isinstance(other, types.Int)) {
        return new types.Int((this.valueOf() ? 1 : 0) << other.valueOf());
    } else {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for <<: 'bool' and '" + type_name(other) + "'");
    }}

Bool.prototype.__rshift__ = function(other) {
    var types = require('../types');

    if (types.isinstance(other, Bool)) {
        if (this.valueOf() && !other.valueOf()) {
            return new types.Int(1);
        } else {
            return new types.Int(0);
        }
    } else if (types.isinstance(other, types.Int)) {
        return new types.Int((this.valueOf() ? 1 : 0) >> other.valueOf());
    } else {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for >>: 'bool' and '" + type_name(other) + "'");
    }}

Bool.prototype.__and__ = function(other) {
    var types = require('../types');

    if (types.isinstance(other, types.Int)) {
        return this.__int__().__and__(other);
    } else if (types.isinstance(other, Bool)) {
        return new Boolean((this.valueOf() ? 1 : 0) & (other.valueOf() ? 1 : 0));
    } else {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for &: 'bool' and '" + type_name(other) + "'");
    }
}

Bool.prototype.__xor__ = function(other) {
    var types = require('../types');

    if (types.isinstance(other, types.Int)) {
        return this.__int__().__xor__(other);
    } else if (types.isinstance(other, Bool)) {
        return new Boolean((this.valueOf() ? 1 : 0) ^ (other.valueOf() ? 1 : 0));
    } else {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for ^: 'bool' and '" + type_name(other) + "'");
    }
}

Bool.prototype.__or__ = function(other) {
    var types = require('../types');

    if (types.isinstance(other, types.Int)) {
        return this.__int__().__or__(other);
    } else if (types.isinstance(other, Bool)) {
        return new Boolean((this.valueOf() ? 1 : 0) | (other.valueOf() ? 1 : 0));
    } else {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for |: 'bool' and '" + type_name(other) + "'");
    }
}

Bool.prototype.__ge__ = function(other) {
    var types = require('../types');

    if (types.isinstance(other, types.Float)) {
        return new types.Float((this.valueOf() ? 1.0 : 0.0) >= other.valueOf());
    } else if (types.isinstance(other, types.Int)) {
        return this.__int__().__ge__(other);
    } else if (types.isinstance(other, Bool)) {
        return new Boolean((this.valueOf() ? 1 : 0) >= (other.valueOf() ? 1 : 0));
    } else if (types.isbataviainstance(other)) {
        throw new exceptions.TypeError.$pyclass("unorderable types: bool() >= " + type_name(other) + "()");
    } else {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for |: 'bool' and '" + type_name(other) + "'");
    }
}

Bool.prototype.__le__ = function(other) {
    var types = require('../types');

    if (types.isinstance(other, types.Float)) {
        return new types.Float((this.valueOf() ? 1.0 : 0.0) <= other.valueOf());
    } else if (types.isinstance(other, types.Int)) {
        return this.__int__().__le__(other);
    } else if (types.isinstance(other, Bool)) {
        return new Boolean((this.valueOf() ? 1 : 0) <= (other.valueOf() ? 1 : 0));
    } else if (types.isbataviainstance(other)) {
        throw new exceptions.TypeError.$pyclass("unorderable types: bool() <= " + type_name(other) + "()");
    } else {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for |: 'bool' and '" + type_name(other) + "'");
    }
}

Bool.prototype.__lt__ = function(other) {
    var types = require('../types');

    if (types.isinstance(other, types.Float)) {
        return new types.Float((this.valueOf() ? 1.0 : 0.0) < other.valueOf());
    } else if (types.isinstance(other, types.Int)) {
        return this.__int__().__lt__(other);
    } else if (types.isinstance(other, Bool)) {
        return new Boolean((this.valueOf() ? 1 : 0) < (other.valueOf() ? 1 : 0));
    } else if (types.isbataviainstance(other)) {
        throw new exceptions.TypeError.$pyclass("unorderable types: bool() < " + type_name(other) + "()");
    } else {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for |: 'bool' and '" + type_name(other) + "'");
    }
}

/**************************************************
 * Inplace operators
 **************************************************/

Bool.prototype.__ifloordiv__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass("Bool.__ifloordiv__ has not been implemented");
}

Bool.prototype.__itruediv__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass("Bool.__itruediv__ has not been implemented");
}

Bool.prototype.__iadd__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass("Bool.__iadd__ has not been implemented");
}

Bool.prototype.__isub__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass("Bool.__isub__ has not been implemented");
}

Bool.prototype.__imul__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass("Bool.__imul__ has not been implemented");
}

Bool.prototype.__imod__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass("Bool.__imod__ has not been implemented");
}

Bool.prototype.__ipow__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass("Bool.__ipow__ has not been implemented");
}

Bool.prototype.__ilshift__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass("Bool.__ilshift__ has not been implemented");
}

Bool.prototype.__irshift__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass("Bool.__irshift__ has not been implemented");
}

Bool.prototype.__iand__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass("Bool.__iand__ has not been implemented");
}

Bool.prototype.__ixor__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass("Bool.__ixor__ has not been implemented");
}

Bool.prototype.__ior__ = function(other) {
    throw new exceptions.NotImplementedError.$pyclass("Bool.__ior__ has not been implemented");
}

/**************************************************
 * Methods
 **************************************************/

Bool.prototype.copy = function() {
    return this.valueOf();
}

Bool.prototype.__trunc__ = function() {
    var types = require('../types');

    if (this.valueOf()) {
        return new types.Int(1);
    }
    return new types.Int(0);
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = Bool;
