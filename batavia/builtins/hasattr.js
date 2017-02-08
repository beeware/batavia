var exceptions = require('../core').exceptions;
var types = require('../types');


function hasattr(args, kwargs) {
    if (args) {
        if (args.length === 2) {
            if (!types.isinstance(args[1], types.Str)) {
                throw new exceptions.TypeError('hasattr(): attribute name must be string');
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

            return val !== undefined
        } else if (args.length < 2) {
            throw new exceptions.TypeError("hasattr expected at least 2 arguments, got " + args.length);
        } else {
            throw new exceptions.TypeError("hasattr expected at most 2 arguments, got " + args.length);
        }
    } else {
        throw new exceptions.TypeError("hasattr expected at least 2 arguments, got 0");
    }
}
hasattr.__doc__ = 'hasattr(object, name) -> bool\n\nReturn whether the object has an attribute with the given name.\n(This is done by calling getattr(object, name) and catching AttributeError.)';

module.exports = hasattr;
