var exceptions = require('../core').exceptions;
var callables = require('../core').callables;
var type_name = require('../core').type_name;
var types = require('../types');

var all = function(args, kwargs) {
    if (args[0] === null) {
        throw new exceptions.TypeError("'NoneType' object is not iterable");
    }
    if (arguments.length != 2) {
        throw new exceptions.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError("all() doesn't accept keyword arguments");
    }
    if (!args || args.length != 1) {
        throw new exceptions.TypeError('all() takes exactly one argument (' + args.length + ' given)');
    }

    if (!args[0].__iter__) {
        throw new exceptions.TypeError("'" + type_name(args[0]) + "' object is not iterable");
    }

    var iterobj = args[0].__iter__()
    try {
        while (true) {
            var next = callables.run_callable(iterobj, iterobj.__next__, [], null);
            var bool_next = callables.run_callable(next, next.__bool__, [], null)
            if (!bool_next) return false
        }
    } catch (err) {
        if (!(err instanceof exceptions.StopIteration)) {
            throw err;
        }
    }

    return new types.Bool(true);
};
all.__doc__ = 'all(iterable) -> bool\n\nReturn True if bool(x) is True for all values x in the iterable.\nIf the iterable is empty, return True.';

module.exports = all;
