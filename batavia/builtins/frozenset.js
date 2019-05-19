var exceptions = require('../core').exceptions
var types = require('../types')

var frozenset = types.FrozenSet.prototype.__class__

frozenset.__call__ = function(args, kwargs) {
    if (arguments.length !== 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass("frozenset() doesn't accept keyword arguments.")
    }
    if (args && args.length > 1) {
        throw new exceptions.TypeError.$pyclass('set expected at most 1 arguments, got ' + args.length)
    }
    if (!args || args.length === 0) {
        return new types.FrozenSet()
    }
    return new types.FrozenSet(args[0])
}
frozenset.__doc__ = 'frozenset() -> empty frozenset object\nfrozenset(iterable) -> frozenset object\n\nBuild an immutable unordered collection of unique elements.'

module.exports = frozenset
