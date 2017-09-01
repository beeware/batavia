var PyObject = require('../core').Object
var None = require('../core').None
var create_pyclass = require('../core').create_pyclass
var exceptions = require('../core').exceptions
var type_name = require('../core').type_name

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

Slice.prototype.__add__ = function(other) {
    var types = require('../types')
    
    throw new exceptions.TypeError.$pyclass(
        'unsupported operand type(s) for +: \'slice\' and \'' + type_name(other) + '\''
    )
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = Slice
