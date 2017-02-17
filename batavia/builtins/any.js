var exceptions = require('../core').exceptions;
var callables = require('../core').callables;
var type_name = require('../core').type_name;


function any(args, kwargs) {
    if (args[0] === null) {
        throw new exceptions.TypeError.$pyclass("'NoneType' object is not iterable");
    }
    if (arguments.length != 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass("any() doesn't accept keyword arguments");
    }
    if (!args || args.length != 1) {
        throw new exceptions.TypeError.$pyclass('any() takes exactly one argument (' + args.length + ' given)');
    }

    if (!args[0].__iter__) {
        throw new exceptions.TypeError.$pyclass("'" + type_name(args[0]) + "' object is not iterable");
    }

    var iterobj = callables.call_method(args[0], "__iter__", []);
    try {
        while (true) {
            var next = callables.call_method(iterobj, "__next__", []);
            var bool_next = callables.call_method(next, "__bool__", []);
            if (bool_next) {
                return true
            }
        }
    } catch (err) {
        if (!(err instanceof exceptions.StopIteration.$pyclass)) {
            throw err;
        }
    }
    return false;
}
any.__doc__ = 'any(iterable) -> bool\n\nReturn True if bool(x) is True for any x in the iterable.\nIf the iterable is empty, return False.';

module.exports = any;
