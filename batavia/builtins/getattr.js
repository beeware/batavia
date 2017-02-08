var exceptions = require('../core').exceptions;
var type_name = require('../core').type_name;
var types = require('../types');


function getattr(args, kwargs) {
    if (args) {
        if (args.length === 2 || args.length === 3) {
            if (!types.isinstance(args[1], types.Str)) {
                throw new exceptions.TypeError('getattr(): attribute name must be string');
            }

            var val;
            if (args[0].__getattr__ === undefined) {
                val = args[0][args[1]];
            } else {
                try {
                    val = args[0].__getattr__(args[1]);
                } catch (err) {
                    if (err instanceof exceptions.AttributeError) {
                        val = undefined;
                    } else {
                        throw err;
                    }
                }
            }

            // If the returned object is a descriptor, invoke it.
            if (val !== undefined && val.__get__ !== undefined) {
                val = val.__get__(args[0], args[0].__class__);
            }

            if (val === undefined) {
                if (args.length === 3) {
                    return args[2];
                } else {
                    var msg;
                    if (args[0] instanceof types.Type) {
                        msg = "type object '" + args[0].__name__ + "' has no attribute '";
                    } else {
                        msg = "'" + type_name(args[0]) + "' object has no attribute '";
                    }
                    throw new exceptions.AttributeError(msg + args[1] + "'");
                }
            } else {
                return val;
            }
        } else if (args.length < 2) {
            throw new exceptions.TypeError("getattr expected at least 2 arguments, got " + args.length);
        } else {
            throw new exceptions.TypeError("getattr expected at most 3 arguments, got " + args.length);
        }
    } else {
        throw new exceptions.TypeError("getattr expected at least 2 arguments, got 0");
    }
}
getattr.__doc__ = "getattr(object, name[, default]) -> value\n\nGet a named attribute from an object; getattr(x, 'y') is equivalent to x.y.\nWhen a default argument is given, it is returned when the attribute doesn't\nexist; without it, an exception is raised in that case.";

module.exports = getattr;
