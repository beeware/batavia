var exceptions = require('../core').exceptions;
var types = require('../types');

var type = function(args, kwargs) {
    if (arguments.length != 2) {
        throw new exceptions.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError("type() doesn't accept keyword arguments");
    }
    if (!args || (args.length != 1 && args.length != 3)) {
        throw new exceptions.TypeError('type() takes 1 or 3 arguments');
    }

    if (args.length === 1) {
        if (args[0] === null) {
            return types.NoneType;
        } else {
            return args[0].__class__;
        }
    } else {
        return new types.Type(args[0], args[1], args[2]);
    }
};
type.__doc__ = "type(object_or_name, bases, dict)\ntype(object) -> the object's type\ntype(name, bases, dict) -> a new type";

module.exports = type;
