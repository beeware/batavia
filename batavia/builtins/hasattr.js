var exceptions = require('../core').exceptions
var native = require('../core').native
var types = require('../types')

function hasattr(args, kwargs) {
    if (args) {
        if (args.length === 2) {
            if (!types.isinstance(args[1], types.Str)) {
                throw new exceptions.TypeError.$pyclass('hasattr(): attribute name must be string')
            }

            var val
            try {
                if (args[0].__getattribute__ === undefined) {
                    val = native.getattr(args[0], args[1])
                } else {
                    val = native.getattr_py(args[0], args[1])
                }
            } catch (err) {
                if (err instanceof exceptions.AttributeError.$pyclass) {
                    val = undefined
                } else {
                    throw err
                }
            }

            return val !== undefined
        } else {
            throw new exceptions.TypeError.$pyclass('hasattr expected exactly 2 arguments, got ' + args.length)
        }
    } else {
        throw new exceptions.TypeError.$pyclass('hasattr expected exactly 2 arguments, got 0')
    }
}
hasattr.__doc__ = 'hasattr(object, name) -> bool\n\nReturn whether the object has an attribute with the given name.\n(This is done by calling getattr(object, name) and catching AttributeError.)'

module.exports = hasattr
