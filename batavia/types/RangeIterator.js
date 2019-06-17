var BigNumber = require('bignumber.js')

var PyObject = require('../core').Object
var exceptions = require('../core').exceptions
var create_pyclass = require('../core').create_pyclass

/**************************************************
 * Range Iterator
 **************************************************/

function RangeIterator(data) {
    PyObject.call(this)
    this.index = data.start
    this.step = data.step
    this.stop = data.stop
}

create_pyclass(RangeIterator, 'range_iterator')

RangeIterator.prototype.__next__ = function() {
    var types = require('../types')

    var retval = new BigNumber(this.index)
    if ((this.step.gt(0) && this.index.lt(this.stop)) ||
        (this.step.lt(0) && this.index.gt(this.stop))) {
        this.index = this.index.add(this.step)
        return new types.Int(retval)
    }
    throw new exceptions.StopIteration.$pyclass()
}

RangeIterator.prototype.__str__ = function() {
    return '<range_iterator object at 0x99999999>'
}

RangeIterator.prototype.__format__ = function(value, formatSpecifier) {
    throw new exceptions.ValueError.$pyclass('ValueError: Unknown format code ' +  formatSpecifier + ' for object of type range_iterator')
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = RangeIterator
