var types = require('../types')
var exceptions = require('../core/exceptions')

var list = types.List.prototype.__class__

list.__call__ = function(args, kwargs) {
    if (arguments.length !== 2) {
        throw new builtins.BataviaError.$pyclass("Batavia calling convention not used.");
    }
    
    // Accept exactly one argument & account for undefined
    if (args.length > 1 || Object.keys(kwargs).length + args.length > 1) {
        throw new exceptions.TypeError.$pyclass('list() takes at most 1 argument (' + (args.length + Object.keys(kwargs).length) + ' given)')
    }

    // No kwargs
    if (kwargs && Object.keys(kwargs).length) {
        throw new exceptions.TypeError.$pyclass("'" + Object.keys(kwargs)[0] + "' is an invalid keyword argument for this function")
    }

    if (!args || args.length === 0) {
        return new types.List()
    }
    
    return new types.List(args[0])
}
list.__doc__ = "list() -> new empty list\nlist(iterable) -> new list initialized from iterable's items"

module.exports = list
