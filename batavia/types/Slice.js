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

Slice.prototype.__dir__ = function() {
    return "['__class__', '__delattr__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__gt__', '__hash__', '__init__', '__le__', '__lt__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', 'indices', 'start', 'step', 'stop']"
}

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
var as_list = function(obj) {
    return [obj.start, obj.stop, obj.step]
}

var as_tuple = function(obj) {
    var types = require('../types')
    return new types.Tuple(as_list(obj))
}

var strip_and_compare = function(a, b, comparison_function) {
    var types = require('../types')
    var a_list = as_list(a)
    var b_list = as_list(b)
    for (var i = 0; i < a_list.length && i < b_list.length; ++i) {
        if (types.isinstance(a_list[i], types.NoneType) && types.isinstance(b_list[i], types.NoneType)) {
            a_list.splice(i, 1)
            b_list.splice(i, 1)
        }
    }
    return new types.Tuple(a_list)[comparison_function](new types.Tuple(b_list))
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

Slice.prototype.__ne__ = function(other) {
    var types = require('../types')
    if (!types.isinstance(other, types.Slice)) {
        return new types.Bool(true)
    }
    return !this.__eq__(other)
}

Slice.prototype.__add__ = unsupported_operand.bind(Slice.prototype, '+')
Slice.prototype.__and__ = unsupported_operand.bind(Slice.prototype, '&')
Slice.prototype.__lshift__ = unsupported_operand.bind(Slice.prototype, '<<')
Slice.prototype.__or__ = unsupported_operand.bind(Slice.prototype, '|')
Slice.prototype.__pow__ = unsupported_operand.bind(Slice.prototype, '** or pow()')
Slice.prototype.__rshift__ = unsupported_operand.bind(Slice.prototype, '>>')
Slice.prototype.__sub__ = unsupported_operand.bind(Slice.prototype, '-')
Slice.prototype.__truediv__ = unsupported_operand.bind(Slice.prototype, '/')
Slice.prototype.__xor__ = unsupported_operand.bind(Slice.prototype, '^')

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
        return strip_and_compare(this, other, '__gt__')
    } else {
        unorderable_types('>', other)
    }
}

Slice.prototype.__lt__ = function(other) {
    var types = require('../types')
    if (types.isinstance(other, types.Slice)) {
        return strip_and_compare(this, other, '__lt__')
    } else {
        unorderable_types('<', other)
    }
}

Slice.prototype.__mod__ = function(other) {
    var types = require('../types')
    if (types.isinstance(other, types.Complex)) {
        throw new exceptions.TypeError.$pyclass(
            'can\'t mod complex numbers.'
        )
    } else {
        unsupported_operand('%', other)
    }
}

Slice.prototype.__mul__ = function(other) {
    var types = require('../types')
    var is_sequence = types.isinstance(other, types.Str) || types.isinstance(other, types.Bytes) || types.isinstance(other, types.Bytearray) || types.isinstance(other, types.List) || types.isinstance(other, types.Tuple)
    if (is_sequence) {
        throw new exceptions.TypeError.$pyclass(
            'can\'t multiply sequence by non-int of type \'slice\''
        )
    } else {
        unsupported_operand('*', other)
    }
}

Slice.prototype.__getitem__ = function(key) {
    throw new exceptions.TypeError.$pyclass(
        '\'slice\' object is not subscriptable'
    )
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = Slice
