var exceptions = require('../core').exceptions
var types = require('../types')

var range = types.Range.prototype.__class__

range.__call__ = function(args, kwargs) {
    if (arguments.length !== 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass("range() doesn't accept keyword arguments")
    }
    if (!args || args.length === 0) {
        throw new exceptions.TypeError.$pyclass('range() expected 1 arguments, got ' + args.length)
    }
    if (args.length > 3) {
        throw new exceptions.TypeError.$pyclass('range() expected at most 3 arguments, got ' + args.length)
    }

    return new types.Range(args[0], args[1], args[2])
}
range.__doc__ = 'range(stop) -> range object\nrange(start, stop[, step]) -> range object\n\nReturn a virtual sequence of numbers from start to stop by step.'

module.exports = range
