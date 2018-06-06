var exceptions = require('../core').exceptions
var types = require('../types')
var type_name = require('../core').type_name

function sum(args, kwargs) {
    if (arguments.length !== 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass("sum() doesn't accept keyword arguments")
    }
    if (!args || args.length === 0) {
        throw new exceptions.TypeError.$pyclass('sum expected at least 1 arguments, got ' + args.length)
    }
    if (args.length > 2) {
        throw new exceptions.TypeError.$pyclass('sum expected at most 2 arguments, got ' + args.length)
    }
    if (!args[0].__iter__) {
        throw new exceptions.TypeError.$pyclass("'" + type_name(args[0]) + "' object is not iterable")
    }
    let value = args[0]
    // This is unique behaviour that is handled before types are resolved and added.
    // Empty strings, sets resolve to zero when provided as a single argument to sum().
    let resolve_to_zero_types = [types.Set, types.Str]
    if (types.isinstance(value, resolve_to_zero_types)) {
        if (value === '' || (types.isinstance(value, types.Set) && value.toString() === (new types.Set()).toString())) {
            return new types.Int(0)
        } else if (types.isinstance(value, types.Str)) {
            // Reject all non-empty strings.
            return new types.Int(0).__add__(value) // This will throw the correct TypeError.
        }
    }
    // Sets need to be handled differently to other iterable types due to use of dict for data.
    if (types.isinstance(value, [types.Set, types.FrozenSet])) {
        return value.data.keys().reduce(function(a, b) {
            return a.__add__(b)
        }, new types.Int(0))
    } else if (types.isinstance(value, types.Range)) {
        // This doesn't work yet due to upstream error.
        let retval = types.Int(0)
        for (let i = value.start; i < value.end; i += value.step) {
            retval = retval.__add__(new types.Int(value.val[i]))
        }
        return retval
    } else if (types.isinstance(value, types.Dict)) {
        // Sum of dict is sum of keys.
        return value.keys().reduce(function(a, b) {
            return a.__add__(b)
        }, new types.Int(0))
    } else if (types.isinstance(value, [types.Bytes, types.Bytearray])) {
        // Sum of bytearray is sum of internal value.
        if (types.isinstance(value, types.Bytearray)) {
            value = value.valueOf()
        }
        let retval = new types.Int(0)
        // Sum of non-empty byte-strings is the sum of ASCII values of each byte.
        if (value.__len__() > 0) {
            for (let i = 0; i < value.__len__(); i++) {
                retval = retval.__add__(new types.Int(value.val[i]))
            }
        }
        return retval
    }
    return value.reduce(function(a, b) {
        return a.__add__(b)
    }, new types.Int(0))
}

sum.__doc__ = "sum(iterable[, start]) -> value\n\nReturn the sum of an iterable of numbers (NOT strings) plus the value\nof parameter 'start' (which defaults to 0).  When the iterable is\nempty, return start."

module.exports = sum
