var PyObject = require('../core').Object
var create_pyclass = require('../core').create_pyclass
var exceptions = require('../core').exceptions

/**************************************************
 * Set Iterator
 **************************************************/

function SetIterator(data) {
    PyObject.call(this)
    this.index = 0
    this.data = data
    this.keys = data.data.keys()
}

create_pyclass(SetIterator, 'set_iterator')

SetIterator.prototype.__next__ = function() {
    var key = this.keys[this.index]
    if (key === undefined) {
        throw new exceptions.StopIteration.$pyclass()
    }
    this.index++
    return key
}

SetIterator.prototype.__str__ = function() {
    return '<set_iterator object at 0x99999999>'
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = SetIterator
