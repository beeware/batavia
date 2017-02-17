var PyObject = require('../core').Object;
var Type = require('../core').Type;
var exceptions = require('../core').exceptions;

/**************************************************
 * Bytearray Iterator
 **************************************************/

function BytearrayIterator(data) {
    PyObject.call(this);
    this.index = 0;
    this.data = data;
};

BytearrayIterator.prototype = Object.create(PyObject.prototype);
BytearrayIterator.prototype.__class__ = new Type('bytearray_iterator');
BytearrayIterator.prototype.__class__.$pyclass = BytearrayIterator;

BytearrayIterator.prototype.__iter__ = function() {
    return this;
};

BytearrayIterator.prototype.__next__ = function() {
    var types = require('../types');

    if (this.index >= this.data.length) {
        throw new exceptions.StopIteration.$pyclass();
    }
    var retval = this.data[this.index];
    this.index++;
    return new types.Int(retval);
};

BytearrayIterator.prototype.__str__ = function() {
    return "<bytearray_iterator object at 0x99999999>";
};

/**************************************************
 * Module exports
 **************************************************/

module.exports = BytearrayIterator;
