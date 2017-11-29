var exceptions = require('../core').exceptions
var types = require('../types')

var type = function(args, kwargs) {
    if (arguments.length !== 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass("type() doesn't accept keyword arguments")
    }
    if (!args || (args.length !== 1 && args.length !== 3)) {
        throw new exceptions.TypeError.$pyclass('type() takes 1 or 3 arguments')
    }

    if (args.length === 1) {
        if (args[0] === null) {
            return types.NoneType
        } else {
            return args[0].__class__
        }
    } else {
        return (function(name, bases, dict) {
            var new_type = new types.Type(args[0], Array.from(args[1]), args[2])

            function NewType() {
                types.Object.call(this)
            }

            NewType.prototype = Object.create(types.Object.prototype)
            NewType.prototype.__class__ = new_type
            NewType.prototype.__class__.$pyclass = NewType

            for (var attr in dict) {
                if (dict.hasOwnProperty(attr)) {
                    NewType.prototype[attr] = dict[attr]
                }
            }

            return new_type
        }(args[0], args[1], args[2]))
    }
}
type.__doc__ = "type(object_or_name, bases, dict)\ntype(object) -> the object's type\ntype(name, bases, dict) -> a new type"

module.exports = type
