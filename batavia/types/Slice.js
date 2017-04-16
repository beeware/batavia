var PyObject = require('../core').Object
var None = require('../core').None
var create_pyclass = require('../core').create_pyclass

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
    var start, stop, step

    if (this.stop === None) {
        stop = 'None'
    } else if (types.isinstance(this.stop, types.Str)) {
        stop = this.stop.__repr__()
    } else {
        stop = this.stop.__str__()
    }

    if (this.start === None) {
        start = 'None'
    } else {
        start = this.start
    }

    if (this.step === None) {
        step = 'None'
    } else {
        step = this.step
    }

    return 'slice(' + start + ', ' + stop + ', ' + step + ')'
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = Slice
