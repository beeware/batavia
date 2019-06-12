var PyObject = require('../core').Object
var create_pyclass = require('../core').create_pyclass
var exceptions = require('../core').exceptions

/**************************************************
 * Bytearray Iterator
 **************************************************/

function BytearrayIterator(data) {
    PyObject.call(this)
    this.index = 0
    this.data = data
};

create_pyclass(BytearrayIterator, 'bytearray_iterator')

BytearrayIterator.prototype.__iter__ = function() {
    return this
}

BytearrayIterator.prototype.__next__ = function() {
    var types = require('../types')

    if (this.index >= this.data.length) {
        throw new exceptions.StopIteration.$pyclass()
    }
    var retval = this.data[this.index]
    this.index++
    return new types.Int(retval)
}

BytearrayIterator.prototype.__str__ = function() {
    return '<bytearray_iterator object at 0x99999999>'
}

BytearrayIterator.prototype.__format__ = function() {
    throw new exceptions.NotImplementedError.$pyclass('bytearray.__format__ has not been implemented')
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = BytearrayIterator
