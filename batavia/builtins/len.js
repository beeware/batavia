var exceptions = require('../core').exceptions
var type_name = require('../core').type_name
var callables = require('../core').callables

function len(args, kwargs) {
    if (!args || args.length !== 1 || args[0] === undefined) {
        throw new exceptions.TypeError.$pyclass('len() takes exactly one argument (' + args.length + ' given)')
    }

    var value = args[0]

    if (value.__len__) {
        return callables.call_method(value, '__len__', [])
    }

    throw new exceptions.TypeError.$pyclass("object of type '" + type_name(value) + "' has no len()")
}

len.__doc__ = 'len(object)\n\nReturn the number of items of a sequence or collection.'

module.exports = len
