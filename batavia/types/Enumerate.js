var PyObject = require('../core').Object
var create_pyclass = require('../core').create_pyclass

/**************************************************
 * Enumerate
 **************************************************/

function Enumerate(iterable) {
    PyObject.call(this)
    this.iterator = iterable.__iter__([])
    this.count = 0
}

create_pyclass(Enumerate, 'enumerate')

Enumerate.prototype.__next__ = function() {
    var item = this.iterator.__next__([])
    var types = require('../types')
    var index = new types.Int(this.count)
    this.count += 1

    return new types.Tuple([index, item])
}

Enumerate.prototype.__iter__ = function() {
    return this
}

Enumerate.prototype.__str__ = function() {
    return '<enumerate object at 0x99999999>'
}

<<<<<<< HEAD
Enumerate.prototype.__format__ = function(value, specifier) {
    if (specifier && specifier !== "") {
        throw new exceptions.TypeError.$pyclass("unsupported format string passed to enumerate.__format__")
    }
    return value;
=======
Enumerate.prototype.__format__ = function (value, formatSpecifier) {
    throw new exceptions.NotImplementedError.$pyclass('enumerate.__format__ has not been implemented')
>>>>>>> 1cfab4f9e42af452917af7ba1b0317b68f0dc469
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = Enumerate
