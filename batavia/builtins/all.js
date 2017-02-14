var exceptions = require('../core').exceptions;
var callables = require('../core').callables;
var type_name = require('../core').type_name;
var types = require('../types');


function all(args, kwargs) {
    if (args[0] === null) {
        throw new exceptions.TypeError.$pyclass("'NoneType' object is not iterable");
    }
    if (arguments.length != 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass("all() doesn't accept keyword arguments");
    }
    if (!args || args.length != 1) {
        throw new exceptions.TypeError.$pyclass('all() takes exactly one argument (' + args.length + ' given)');
    }

    if (!args[0].__iter__) {
        throw new exceptions.TypeError.$pyclass("'" + type_name(args[0]) + "' object is not iterable");
    }

    var iterobj = args[0].__iter__();
    try {
        while (true) {
            var next = iterobj.__next__();
            var bool_next = next.__bool__();
            if (!bool_next) {
                return false;
            }
        }
    } catch (err) {
        if (!(err instanceof exceptions.StopIteration.$pyclass)) {
            throw err;
        }
    }

    return new types.Bool(true);
}
all.__doc__ = 'all(iterable) -> bool\n\nReturn True if bool(x) is True for all values x in the iterable.\nIf the iterable is empty, return True.';

module.exports = all;
