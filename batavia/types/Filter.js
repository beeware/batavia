var PyObject = require('../core').Object
var callables = require('../core').callables
var exceptions = require('../core').exceptions
var type_name = require('../core').type_name
var create_pyclass = require('../core').create_pyclass

/*************************************************************************
 * A Python filter builtin is a type
 *************************************************************************/

function Filter(args, kwargs) {
    PyObject.call(this)

    if (args.length < 2) {
        throw new exceptions.TypeError.$pyclass('filter expected 2 arguments, got ' + args.length)
    }
    this._func = args[0]
    this._sequence = args[1]
}

create_pyclass(Filter, 'filter')

/**************************************************
 * Javascript compatibility methods
 **************************************************/

Filter.prototype.toString = function() {
    return this.__str__()
}

/**************************************************
 * Type conversions
 **************************************************/

Filter.prototype.__iter__ = function() {
    return this
}

Filter.prototype.__next__ = function() {
    var builtins = require('../builtins')

    if (!this._iter) {
        this._iter = builtins.iter([this._sequence], null)
    }
    if (!builtins.callable([this._func], null)) {
        throw new exceptions.TypeError.$pyclass(type_name(this._func) + "' object is not callable")
    }

    var val, more
    do {
        val = callables.call_method(this._iter, '__next__', [])
        more = !callables.call_function(this._func, [val], null)
    } while (more)

    return val
}

Filter.prototype.__str__ = function() {
    return '<filter object at 0x99999999>'
}

Filter.prototype.__format__ = function(){
    throw new exceptions.ValueError.$pyclass('ValueError: Unknown format code ' +  formatSpecifier + ' for object of type ' + className)
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = Filter
