var Type = require('../core').Type
var Function = require('./Function')

/*************************************************************************
 * A Python method type
 *************************************************************************/

function Method(instance, func) {
    Function.call(
        this,
        func.__name__,
        func.__code__,
        func.__globals__,
        func.__defaults__,
        func.__closure__,
        func.$vm
    )
    this.__self__ = instance
    this.__func__ = func
    this.__class__ = instance.__class__
}

Method.prototype = Object.create(Function.prototype)
Method.prototype.__class__ = new Type('method')
Method.prototype.__class__.$pyclass = Method

/**************************************************
 * Module exports
 **************************************************/

module.exports = Method
