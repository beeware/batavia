var exceptions = require('../core').exceptions;
var types = require('../types');


function set(args, kwargs) {
    if (arguments.length != 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass("set() doesn't accept keyword arguments.");
    }
    if (args && args.length > 1) {
        throw new exceptions.TypeError.$pyclass("set expected at most 1 arguments, got " + args.length);
    }
    if (!args || args.length == 0) {
        return new types.Set();
    }
    return new types.Set(args[0]);
}
set.__doc__ = 'set() -> new empty set object\nset(iterable) -> new set object\n\nBuild an unordered collection of unique elements.';

module.exports = set;
