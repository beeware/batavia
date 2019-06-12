var PyObject = require('../core').Object
var create_pyclass = require('../core').create_pyclass
var exceptions = require('../core').exceptions

/**************************************************
 * Str Iterator
 **************************************************/

function StrIterator(data) {
    PyObject.call(this)
    this.index = 0
    this.data = data
}

create_pyclass(StrIterator, 'str_iterator')

StrIterator.prototype.__next__ = function() {
    var retval = this.data[this.index]
    if (retval === undefined) {
        throw new exceptions.StopIteration.$pyclass()
    }
    this.index++
    return retval
}

StrIterator.prototype.__str__ = function() {
    return '<str_iterator object at 0x99999999>'
}

StrIterator.prototype.__format__ = function(value, formatSpecifier) {
    if(formatSpecifier === ""){
        return value.__str__()
    }
    throw new exceptions.ValueError.$pyclass(`ValueError: Unknown format code ${formatSpecifier} for object of type '${className}'`)
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = StrIterator
