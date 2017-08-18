var exceptions = require('../core').exceptions
var hasattr = require('./hasattr')
var call_method = require('../core').callables.call_method

function vars(args, kwargs) {
    var locals = require('../builtins').locals.bind(this)
    if (arguments.length !== 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass("vars() doesn't accept keyword arguments")
    }
    if (args && args.length > 1) {
        throw new exceptions.TypeError.$pyclass('vars() takes at most one argument (' + args.length + ' given)')
    }
    if (!args || args.length === 0) {
        return locals()
    }
    var value = args[0]
    if (!hasattr([value, '__dict__'])) {
        throw new exceptions.TypeError.$pyclass('vars() argument must have __dict__ attribute')
    }
    return call_method(value, '__dict__')
}
vars.__doc__ = 'vars([object]) -> dictionary\n\nWithout arguments, equivalent to locals().\nWith an argument, equivalent to object.__dict__.'

module.exports = vars
