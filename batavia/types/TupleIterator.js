var PyObject = require('../core').Object;
var Type = require('../core').Type;
var exceptions = require('../core').exceptions;

/**************************************************
 * Tuple Iterator
 **************************************************/

function TupleIterator(data) {
    PyObject.call(this);
    this.index = 0;
    this.data = data;
}

TupleIterator.prototype = Object.create(PyObject.prototype);
TupleIterator.prototype.__class__ = new Type('tuple_iterator');
TupleIterator.prototype.__class__.$pyclass = TupleIterator;

TupleIterator.prototype.__next__ = function() {
    var retval = this.data[this.index];
    if (retval === undefined) {
        throw new exceptions.StopIteration.$pyclass();
    }
    this.index++;
    return retval;
}

TupleIterator.prototype.__str__ = function() {
    return "<tuple_iterator object at 0x99999999>";
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = TupleIterator;
