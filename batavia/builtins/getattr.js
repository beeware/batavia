var exceptions = require('../core').exceptions
var native = require('../core').native
var types = require('../types')

function getattr(args, kwargs) {
    if (args) {
        if (args.length === 2 || args.length === 3) {
            if (!types.isinstance(args[1], types.Str)) {
                throw new exceptions.TypeError.$pyclass('getattr(): attribute name must be string')
            }

            try {
                if (args[0].__getattribute__ === undefined) {
                    return native.getattr(args[0], args[1])
                } else {
                    if (args[0].__class__ !== undefined) {
                        if (args[0].__class__.__getattribute__(args[0], '__getattribute__') instanceof types.Method) {
                            return args[0].__class__.__getattribute__(args[0], '__getattribute__').__call__(args[1])
                        } else {
                            return args[0].__class__.__getattribute__(args[0], args[1])
                        }
                    } else {
                        return args[0].__getattribute__(args[1])
                    }
                }
            } catch (e) {
                if (e instanceof exceptions.AttributeError.$pyclass && args.length === 3) {
                    return args[2]
                } else {
                    throw e
                }
            }
        } else if (args.length < 2) {
            throw new exceptions.TypeError.$pyclass('getattr expected at least 2 arguments, got ' + args.length)
        } else {
            throw new exceptions.TypeError.$pyclass('getattr expected at most 3 arguments, got ' + args.length)
        }
    } else {
        throw new exceptions.TypeError.$pyclass('getattr expected at least 2 arguments, got 0')
    }
}
getattr.__doc__ = "getattr(object, name[, default]) -> value\n\nGet a named attribute from an object; getattr(x, 'y') is equivalent to x.y.\nWhen a default argument is given, it is returned when the attribute doesn't\nexist; without it, an exception is raised in that case."

module.exports = getattr
