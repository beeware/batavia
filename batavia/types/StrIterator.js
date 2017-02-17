var PyObject = require('../core').Object;
var Type = require('../core').Type;
var exceptions = require('../core').exceptions;

/**************************************************
 * Str Iterator
 **************************************************/

function StrIterator(data) {
    PyObject.call(this);
    this.index = 0;
    this.data = data;
}

StrIterator.prototype = Object.create(PyObject.prototype);
StrIterator.__class__ = new Type('str_iterator');
StrIterator.prototype.__class__.$pyclass = StrIterator;

StrIterator.prototype.__next__ = function() {
    var retval = this.data[this.index];
    if (retval === undefined) {
        throw new exceptions.StopIteration.$pyclass();
    }
    this.index++;
    return retval;
}

StrIterator.prototype.__str__ = function() {
    return "<str_iterator object at 0x99999999>";
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = StrIterator;
