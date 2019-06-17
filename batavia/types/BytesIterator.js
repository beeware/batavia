var PyObject = require('../core').Object
var create_pyclass = require('../core').create_pyclass
var exceptions = require('../core').exceptions
var types = require('../types')

/**************************************************
 * Bytes Iterator
 **************************************************/
const className = 'bytes_iterator';

function BytesIterator(data) {
    PyObject.call(this)
    this.index = 0
    this.data = data
};

create_pyclass(BytesIterator, className)

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

BytesIterator.prototype.__format__ = function(value, formatSpecifier) {
    throw new exceptions.ValueError.$pyclass('ValueError: Unknown format code ' +  formatSpecifier + ' for object of type ' + className)
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = BytesIterator
