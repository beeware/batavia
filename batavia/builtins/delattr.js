var exceptions = require('../core').exceptions
var native = require('../core').native
var type_name = require('../core').type_name
var types = require('../types')

function delattr(args, kwargs) {
    if (args) {
        if (args.length === 2) {
            if (!types.isinstance(args[1], types.Str)) {
                throw new exceptions.TypeError.$pyclass("attribute name must be string, not '" + type_name(args[1]) + "'")
            }

            var val
            if (args[0].__delattr__ === undefined) {
                native.delattr(args[0], args[1])
            } else {
                val = args[0].__delattr__(args[1])
            }
        } else {
            throw new exceptions.TypeError.$pyclass('delattr expected exactly 2 arguments, got ' + args.length)
        }
    } else {
        throw new exceptions.TypeError.$pyclass('delattr expected exactly 2 arguments, got 0')
    }
}
delattr.__doc__ = "delattr(object, name)\n\nDelete a named attribute on an object; delattr(x, 'y') is equivalent to\n``del x.y''."

module.exports = delattr
