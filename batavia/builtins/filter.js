var exceptions = require('../core').exceptions
var types = require('../types')

var filter = types.Filter.prototype.__class__

filter.__call__ = function(args, kwargs) {
    if (args.length !== 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass("filter() doesn't accept keyword arguments")
    }

    if (args[1].__iter__ === undefined) {
        throw new exceptions.TypeError.$pyclass("'" + args[1].__class__.__name__ + "' object is not iterable")
    }
    return new types.Filter(args, kwargs)
}
filter.__doc__ = 'filter(function or None, iterable) --> filter object\n\nReturn an iterator yielding those items of iterable for which function(item)\nis true. If function is None, return the items that are true.'

module.exports = filter
