var exceptions = require('../core').exceptions;
var type_name = require('../core').type_name;
var types = require('../types');


function bin(args, kwargs) {
    if (arguments.length != 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass("bin() doesn't accept keyword arguments");
    }
    if (!args || args.length != 1) {
        throw new exceptions.TypeError.$pyclass('bin() expected exactly 1 argument (' + args.length + ' given)');
    }

    var obj = args[0];

    if (!types.isinstance(obj, types.Int)) {
        throw new exceptions.TypeError.$pyclass(
            "'" + type_name(obj) + "' object cannot be interpreted as an integer");
    }

    return new types.Str("0b" + obj.toString(2));
}
bin.__doc__ = "bin(number) -> string\n\nReturn the binary representation of an integer.\n\n   ";

module.exports = bin;
