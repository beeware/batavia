var PyObject = require('../core').Object
var create_pyclass = require('../core').create_pyclass
var exceptions = require('../core').exceptions

/**************************************************
 * Tuple Iterator
 **************************************************/

function TupleIterator(data) {
    PyObject.call(this)
    this.index = 0
    this.data = data
}

create_pyclass(TupleIterator, 'tuple_iterator')

TupleIterator.prototype.__next__ = function() {
    var retval = this.data[this.index]
    if (retval === undefined) {
        throw new exceptions.StopIteration.$pyclass()
    }
    this.index++
    return retval
}

TupleIterator.prototype.__str__ = function() {
    return '<tuple_iterator object at 0x99999999>'
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = TupleIterator
