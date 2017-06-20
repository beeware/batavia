var PyObject = require('../core').Object
var callables = require('../core').callables
var exceptions = require('../core').exceptions
var create_pyclass = require('../core').create_pyclass

/*************************************************************************
 * A Python zip builtin is a type
 *************************************************************************/

function Zip(args, kwargs) {
    var builtins = require('../builtins')
    PyObject.call(this)

    this._iterables = args
    this._iterators = []

    for (var i = 0, n = 1; i < args.length; i++, n++) {
        try {
            this._iterators.push(builtins.iter([this._iterables[i]], null))
        } catch (e) {
            if (e instanceof exceptions.TypeError.$pyclass) {
                throw new exceptions.TypeError.$pyclass('zip argument #' + n + ' must support iteration')
            }
        }
    }
}

create_pyclass(Zip, 'zip')

/**************************************************
 * Javascript compatibility methods
 **************************************************/

Zip.prototype.toString = function() {
    return this.__str__()
}

/**************************************************
 * Type conversions
 **************************************************/

Zip.prototype.__iter__ = function() {
    return this
}

Zip.prototype.__next__ = function() {
    var Tuple = require('./Tuple')

    var values = []
    for (var i = 0; i < this._iterators.length; i++) {
        values.push(callables.call_method(this._iterators[i], '__next__'))
    }
    return new Tuple(values)
}

Zip.prototype.__str__ = function() {
    return '<zip object at 0x99999999>'
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = Zip
