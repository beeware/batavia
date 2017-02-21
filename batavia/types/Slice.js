var PyObject = require('../core').Object
var Type = require('../core').Type
var None = require('../core').None

/*************************************************************************
 * An implementation of slice
 *************************************************************************/

function Slice(kwargs) {
    PyObject.call(this)

    // BUG: slices can support arbitrary-sized arguments.
    this.start = kwargs.start === None ? null : kwargs.start.int32()
    this.stop = kwargs.stop === None ? null : kwargs.stop.int32()
    this.step = (kwargs.step || 1) | 0
}

Slice.prototype = Object.create(PyObject.prototype)
Slice.prototype.__class__ = new Type('slice')
Slice.prototype.__class__.$pyclass = Slice

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
    if (this.step) {
        return '(' + this.start + ', ' + this.stop + ', ' + this.step + ')'
    } else {
        return '(' + this.start + ', ' + this.stop + ')'
    }
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = Slice
