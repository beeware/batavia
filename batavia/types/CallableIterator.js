var PyObject = require('../core').Object
var exceptions = require('../core').exceptions
var create_pyclass = require('../core').create_pyclass

/**************************************************
 * Callable Iterator
 **************************************************/

function CallableIterator(callable, sentinel) {
    PyObject.call(this)
    this.callable = callable
    this.sentinel = sentinel
    this.exhausted = false
}

create_pyclass(CallableIterator, 'callable_iterator')

CallableIterator.prototype.__next__ = function() {
    if (this.exhausted) {
        throw new exceptions.StopIteration.$pyclass()
    }

    var item = this.callable.__call__([])
    if (item.__eq__(this.sentinel)) {
        this.exhausted = true
        throw new exceptions.StopIteration.$pyclass()
    }
    return item
}

CallableIterator.prototype.__iter__ = function() {
    return this
}

CallableIterator.prototype.__str__ = function() {
    return '<callable_iterator object at 0x99999999>'
}

CallableIterator.prototype.__format__ = function(value, formatSpecifier) {
    if(formatSpecifier === ""){
        return value.__str__()
    }
    throw new exceptions.ValueError.$pyclass('ValueError: Unknown format code' +  formatSpecifier + 'for object of type ' + className)
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = CallableIterator
