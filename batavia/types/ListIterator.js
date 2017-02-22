var PyObject = require('../core').Object
var Type = require('../core').Type
var exceptions = require('../core').exceptions

/**************************************************
 * List Iterator
 **************************************************/

function ListIterator(data) {
    PyObject.call(this)
    this.index = 0
    this.data = data
};

ListIterator.prototype = Object.create(PyObject.prototype)
ListIterator.prototype.__class__ = new Type('list_iterator')
ListIterator.prototype.__class__.$pyclass = ListIterator

ListIterator.prototype.__iter__ = function() {
    return this
}

ListIterator.prototype.__next__ = function() {
    if (this.index >= this.data.length) {
        throw new exceptions.StopIteration.$pyclass()
    }
    var retval = this.data[this.index]
    this.index++
    return retval
}

ListIterator.prototype.__str__ = function() {
    return '<list_iterator object at 0x99999999>'
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = ListIterator
