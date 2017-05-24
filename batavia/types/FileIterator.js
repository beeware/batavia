var PyObject = require('../core').Object
var create_pyclass = require('../core').create_pyclass
var exceptions = require('../core').exceptions

/**************************************************
 * File Iterator
 **************************************************/

function FileIterator(contents) {
    PyObject.call(this)
		
	this.contents = contents
	this.index = 0
};

create_pyclass(FileIterator, 'file_iterator')

FileIterator.prototype.__iter__ = function() {
    return this
}

FileIterator.prototype.__next__ = function() {
    var types = require('../types')

    if (this.index >= this.contents.length) {
        throw new exceptions.StopIteration.$pyclass()
    }
	
    var retval = this.contents[this.index]
    this.index += 1
    return retval
}

FileIterator.prototype.__str__ = function() {
    return '<file_iterator object at 0x99999999>'
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = FileIterator
