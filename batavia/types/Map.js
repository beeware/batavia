/* eslint-disable no-extend-native */
var PyObject = require('../core').Object
var exceptions = require('../core').exceptions
var callables = require('../core').callables
var type_name = require('../core').type_name
var create_pyclass = require('../core').create_pyclass

/*************************************************************************
 * A Python map builtin is a type
 *************************************************************************/

function Map(args, kwargs) {
    PyObject.call(this)

    if (args.length < 2) {
        throw new exceptions.TypeError.$pyclass('map expected 2 arguments, got ' + args.length)
    }
    this._func = args[0]
    this._sequence = args[1]
}

create_pyclass(Map, 'map')

/**************************************************
 * Javascript compatibility methods
 **************************************************/

Map.prototype.toString = function() {
    return this.__str__()
}

/**************************************************
 * Type conversions
 **************************************************/

Map.prototype.__iter__ = function() {
    return this
}

Map.prototype.__next__ = function() {
    var builtins = require('../builtins')

    if (!this._iter) {
        this._iter = builtins.iter([this._sequence], null)
    }
    if (!builtins.callable([this._func], null)) {
        throw new exceptions.TypeError.$pyclass(
            type_name(this._func) + "' object is not callable")
    }

    var val = callables.call_method(this._iter, '__next__', [])
    return callables.call_function(this._func, [val], null)
}

Map.prototype.__str__ = function() {
    return '<map object at 0x99999999>'
}

Map.prototype.__format__ = function(value, formatSpecifier) {
    if(formatSpecifier === ""){
        return value.__str__()
    }
    throw new exceptions.ValueError.$pyclass('ValueError: Unknown format code' +  formatSpecifier + 'for object of type ' + className)
}

/**************************************************
 * Module exports
 **************************************************/

module.exports = Map
