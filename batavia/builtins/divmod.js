var exceptions = require('../core').exceptions
var types = require('../types')
var type_name = require('../core').type_name

// An alternative to Int.prototype.__truediv__ which is not suitable here because it returns a float
function custom_div(first, other) {
    if (!types.isinstance(first, types.Int)) {
        return first.__div__(other)
    }

    // if it is dividing by another int, we can allow both to be bigger than floats
    if (types.isinstance(other, types.Int)) {
        if (other.val.isZero()) {
            throw new exceptions.ZeroDivisionError.$pyclass('division by zero')
        }
        var result = first.val.div(other.val)
        // check for negative 0
        if (other.val.lt(0) && result.isZero()) {
            return new types.Float(parseFloat('-0.0'))
        }
        return new types.Int(result)
    } else if (types.isinstance(other, types.Float)) {
        return first.__float__().__div__(other)
    } else if (types.isinstance(other, types.Bool)) {
        if (other.valueOf()) {
            return custom_div(first, new types.Int(1))
        } else {
            return custom_div(first, new types.Int(0))
        }
    } else if (types.isinstance(other, types.Complex)) {
        var castToComplex = new types.Complex(first.valueOf())
        return castToComplex.__truediv__(other.valueOf())
    } else {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for /: 'int' and '" + type_name(other) + "'")
    }
}

function divmod(args, kwargs) {
    var notAllowedTypes = [types.Bytearray, types.Bytes, types.Dict, types.FrozenSet, types.List, types.NoneType, types.NotImplementedType, types.Range, types.Set, types.Slice, types.Str, types.Tuple, types.Type]
    if (arguments.length !== 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass("divmod() doesn't accept keyword arguments")
    }
    if (!args || args.length !== 2) {
        throw new exceptions.TypeError.$pyclass('divmod expected 2 arguments, got ' + args.length)
    }
    if (types.isinstance(args[0], types.Complex) || types.isinstance(args[1], types.Complex)) {
        throw new exceptions.TypeError.$pyclass("can't take floor or mod of complex number.")
    }
    if (types.isinstance(args[0], notAllowedTypes) || types.isinstance(args[1], notAllowedTypes)) {
        throw new exceptions.TypeError.$pyclass("unsupported operand type(s) for divmod(): '" + type_name(args[0]) + "' and '" + type_name(args[1]) + "'")
    }
    if (args[0].__abs__ && args[1].__abs__ && (types.isinstance(args[0], types.Float) || types.isinstance(args[1], types.Float)) && (args[0].__abs__().__gt__(types.Float.prototype.MAX_FLOAT) || args[1].__abs__().__gt__(types.Float.prototype.MAX_FLOAT))) {
        throw new exceptions.OverflowError.$pyclass('int too large to convert to float')
    }
    if (args[1].__eq__(new types.Int(0))) {
        if (types.isinstance(args[0], types.Float) || types.isinstance(args[1], types.Float)) {
            throw new exceptions.ZeroDivisionError.$pyclass('float divmod()')
        }
        throw new exceptions.ZeroDivisionError.$pyclass('integer division or modulo by zero')
    }

    var div = custom_div(args[0].__sub__(args[0].__mod__(args[1])), args[1])

    var rem = args[0].__mod__(args[1])

    if (isNaN(rem) && types.isinstance(args[0], types.Bool)) {
        rem = args[0]
    }
    return new types.Tuple([div, rem])
}
divmod.__doc__ = 'Return the tuple ((x-x%y)/y, x%y).  Invariant: div*y + mod === x.'

module.exports = divmod
