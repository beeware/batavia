var exceptions = require('../core').exceptions
var type_name = require('../core').type_name
var types = require('../types')

function len(args, kwargs) {
    if (!args || args.length !== 1 || args[0] === undefined) {
        throw new exceptions.TypeError.$pyclass('len() takes exactly one argument (' + args.length + ' given)')
    }

    var value = args[0]

    if (types.isinstance(value, [types.Float, types.Int])) {
    throw new exceptions.TypeError.$pyclass("object of type '" + type_name(value) + "' has no len()")
    }

    // if (args[0].hasOwnProperty("__len__")) {
        // TODO: Fix context of python functions calling with proper vm
        // throw new exceptions.NotImplementedError.$pyclass('Builtin Batavia len function is not supporting __len__ implemented.');
        // return args[0].__len__.apply(vm);
    // }

    return new types.Int(args[0].length)
}
len.__doc__ = 'len(object)\n\nReturn the number of items of a sequence or collection.'

module.exports = len
