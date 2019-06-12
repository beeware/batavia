var PyObject = require('../core').Object
var create_pyclass = require('../core').create_pyclass
var exceptions = require('../core').exceptions

/**************************************************
 * Bytearray Iterator
 **************************************************/

function BytearrayIterator(data) {
    PyObject.call(this)
    this.index = 0
    this.data = data
};

create_pyclass(BytearrayIterator, 'bytearray_iterator')

BytearrayIterator.prototype.__iter__ = function() {
    return this
}

BytearrayIterator.prototype.__next__ = function() {
    var types = require('../types')

    if (this.index >= this.data.length) {
        throw new exceptions.StopIteration.$pyclass()
    }
    var retval = this.data[this.index]
    this.index++
    return new types.Int(retval)
}

BytearrayIterator.prototype.__str__ = function() {
    return '<bytearray_iterator object at 0x99999999>'
}

BytearrayIterator.prototype.__format__ = function(...args) {
    if(args.length === 0){
        throw new exceptions.TypeError.$pyclass("descriptor '__format__' of 'object' object needs an argument")
    }
    if(args.length !== 2){
        throw new exceptions.TypeError.$pyclass('__format__() takes exactly one argument (' + args.length - 1 + ' given)')
    }
    if (args[1] === "") {
       return args[0]; 
    }
    return args[0]; 
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = BytearrayIterator
