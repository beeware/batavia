var exceptions = require('../core').exceptions;


function getattr(args, kwargs) {
    if (args) {
        var attr = args[0][args[1]];
        if (attr !== undefined) {
            return attr;
        } else {
            if (args.length === 3) {
                return args[2];
            } else if (args.length === 2) {
                throw new exceptions.AttributeError("'" + args[0] + "' object has no attribute '" + args[1] + "'");
            } else if (args.length < 2) {
                throw new exceptions.TypeError("getattr expected at least 2 arguments, got " + args.length);
            } else {
                throw new exceptions.TypeError("getattr expected at most 3 arguments, got " + args.length);
            }
        }
    } else {
        throw new exceptions.TypeError("getattr expected at least 2 arguments, got 0");
    }
}
getattr.__doc__ = "getattr(object, name[, default]) -> value\n\nGet a named attribute from an object; getattr(x, 'y') is equivalent to x.y.\nWhen a default argument is given, it is returned when the attribute doesn't\nexist; without it, an exception is raised in that case.";

module.exports = getattr;
