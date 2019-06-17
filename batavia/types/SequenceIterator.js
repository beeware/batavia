var PyObject = require('../core').Object
var create_pyclass = require('../core').create_pyclass
var exceptions = require('../core').exceptions
var callables = require('../core').callables

var Int = require('./Int')

/**************************************************
 * Sequence Iterator
 **************************************************/

function SequenceIterator(data) {
    PyObject.call(this)
    var len = callables.call_method(data, '__len__', [])

    this.index = 0
    this.data = data
    this.length = len.valueOf()
}

create_pyclass(SequenceIterator, 'iterator')

SequenceIterator.prototype.__iter__ = function() {
    return this
}

SequenceIterator.prototype.__next__ = function() {
    if (this.index >= this.length) {
      throw new exceptions.StopIteration.$pyclass()
    }

    var i = new Int(this.index)
    var retval = callables.call_method(this.data, '__getitem__', [i])
    this.index++
    return retval
}

SequenceIterator.prototype.__str__ = function() {
    return '<iterator object at 0x99999999>'
}

SequenceIterator.prototype.__format__ = function(value, formatSpecifier) {
    throw new exceptions.ValueError.$pyclass('ValueError: Unknown format code ' +  formatSpecifier + ' for object of type iterator')
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = SequenceIterator
