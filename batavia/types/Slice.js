var PyObject = require('../core').Object
var None = require('../core').None
var create_pyclass = require('../core').create_pyclass
var exceptions = require('../core').exceptions
var type_name = require('../core').type_name
var version = require('../core').version

/*************************************************************************
 * An implementation of slice
 *************************************************************************/

function Slice(kwargs) {
    PyObject.call(this)

    // BUG: slices can support arbitrary-sized arguments.
    this.start = kwargs.start
    this.stop = kwargs.stop
    this.step = kwargs.step
}

create_pyclass(Slice, 'slice')

/**************************************************
 * Javascript compatibility methods
 **************************************************/

Slice.prototype.toString = function() {
    return this.__str__()
}

/**************************************************
 * Type conversions
 **************************************************/

Slice.prototype.__repr__ = function() {
    return this.__str__()
}

Slice.prototype.__str__ = function() {
    var types = require('../types')
    var output_vals = [this.start, this.stop, this.step]
    var output_str = []

    for (var i = 0, len = output_vals.length; i < len; i++) {
        if (output_vals[i] === None) {
            output_str.push('None')
        } else if (types.isinstance(output_vals[i], types.Str)) {
            output_str.push(output_vals[i].__repr__())
        } else {
            output_str.push(output_vals[i].__str__())
        }
    }

    return 'slice(' + output_str[0] + ', ' + output_str[1] + ', ' + output_str[2] + ')'
}

/**************************************************
 * Operands
 **************************************************/

// In CPython, the comparison between two slices is done by converting them into tuples, but conversion by itself is not allowed.
var as_tuple = function(obj) {
    var types = require('../types')
    var components = [obj.start, obj.stop, obj.step]
    return new types.Tuple(components)
}

var unsupported_operand = function(sign, other) {
    throw new exceptions.TypeError.$pyclass(
        'unsupported operand type(s) for ' + sign + ': \'slice\' and \'' + type_name(other) + '\''
    )
}

var unorderable_types = function(sign, other) {
    if (version.earlier('3.6')) {
        throw new exceptions.TypeError.$pyclass(
            'unorderable types: slice() ' + sign + ' ' + type_name(other) + '()'
        )
    } else {
        throw new exceptions.TypeError.$pyclass(
            '\'' + sign + '\' not supported between instances of \'slice\' and \'' +
            type_name(other) + '\''
        )
    }
}

Slice.prototype.__eq__ = function(other) {
    var types = require('../types')
    if (!types.isinstance(other, types.Slice)) {
        return new types.Bool(false)
    }
    return (this.start === other.start && this.stop === other.stop && this.step === other.step)
}

Slice.prototype.__add__ = unsupported_operand.bind(Slice.prototype, '+')
Slice.prototype.__and__ = unsupported_operand.bind(Slice.prototype, '&')
Slice.prototype.__lshift__ = unsupported_operand.bind(Slice.prototype, '<<')

Slice.prototype.__floordiv__ = function(other) {
    var types = require('../types')
    if (types.isinstance(other, types.Complex)) {
        throw new exceptions.TypeError.$pyclass(
            'can\'t take floor of complex number.'
        )
    } else {
        unsupported_operand('//', other)
    }
}

Slice.prototype.__ge__ = function(other) {
    var types = require('../types')
    if (types.isinstance(other, types.Slice)) {
        return as_tuple(this).__ge__(as_tuple(other))
    } else {
        unorderable_types('>=', other)
    }
}

Slice.prototype.__le__ = function(other) {
    var types = require('../types')
    if (types.isinstance(other, types.Slice)) {
        return as_tuple(this).__le__(as_tuple(other))
    } else {
        unorderable_types('<=', other)
    }
}

Slice.prototype.__gt__ = function(other) {
    var types = require('../types')
    if (types.isinstance(other, types.Slice)) {
        return as_tuple(this).__gt__(as_tuple(other))
    } else {
        unorderable_types('>', other)
    }
}

Slice.prototype.__lt__ = function(other) {
    var types = require('../types')
    if (types.isinstance(other, types.Slice)) {
        return as_tuple(this).__lt__(as_tuple(other))
    } else {
        unorderable_types('<', other)
    }
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = Slice
