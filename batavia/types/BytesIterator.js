var PyObject = require('../core').Object
var create_pyclass = require('../core').create_pyclass
var exceptions = require('../core').exceptions

/**************************************************
 * Bytes Iterator
 **************************************************/

function BytesIterator(data) {
    PyObject.call(this)
    this.index = 0
    this.data = data
};

create_pyclass(BytesIterator, 'bytes_iterator')

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

BytesIterator.prototype.__format__ = function() {
    throw new exceptions.NotImplementedError.$pyclass('bytes_iterator.__format__ has not been implemented')
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = BytesIterator
