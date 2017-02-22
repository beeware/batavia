var PyObject = require('../core').Object
var Type = require('../core').Type
var exceptions = require('../core').exceptions

/**************************************************
 * Bytes Iterator
 **************************************************/

function BytesIterator(data) {
    PyObject.call(this)
    this.index = 0
    this.data = data
};

BytesIterator.prototype = Object.create(PyObject.prototype)
BytesIterator.prototype.__class__ = new Type('bytes_iterator')
BytesIterator.prototype.__class__.$pyclass = BytesIterator

BytesIterator.prototype.__iter__ = function() {
    return this
}

BytesIterator.prototype.__next__ = function() {
    var types = require('../types')

    if (this.index >= this.data.length) {
        throw new exceptions.StopIteration.$pyclass()
    }
    var retval = this.data[this.index]
    this.index++
    return new types.Int(retval)
}

BytesIterator.prototype.__str__ = function() {
    return '<bytes_iterator object at 0x99999999>'
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = BytesIterator
