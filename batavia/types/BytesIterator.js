var PyObject = require('../core').Object
var create_pyclass = require('../core').create_pyclass
var exceptions = require('../core').exceptions
var types = require('../types')

/**************************************************
 * Bytes Iterator
 **************************************************/

function BytesIterator(data) {
    PyObject.call(this)
    this.index = 0
    this.data = data
};

create_pyclass(BytesIterator, 'bytes_iterator')

BytesIterator.prototype.__iter__ = function() {
    return this
}

BytesIterator.prototype.__next__ = function() {
    var types = require('../types')

    if (this.index >= this.data.length) {
        throw new exceptions.StopIteration.$pyclass()
    }
    var retval = this.data[this.index]
    this.index++
    return new types.Int(retval)
}

BytesIterator.prototype.__str__ = function() {
    // TODO: change to <bytes_iterator object at 0x00310D30>
    return '<bytearray_iterator object at 0x99999999>'
}

// BytesIterator.prototype.__format__ = function(value) {
//     if(types.isinstance(args[0], types.Bytes)){
//         return 
//     }
//     return args[0]; 
// }

/**************************************************
 * Module exports
 **************************************************/

module.exports = BytesIterator
