var exceptions = require('../core').exceptions
var type_name = require('../core').type_name
var types = require('../types')

function dict(args, kwargs) {
    if (arguments.length !== 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (args.length > 1) {
        throw new exceptions.TypeError.$pyclass('dict expected at most 1 arguments, got ' + args.length)
    }
    if (types.isinstance(args[0], [types.Int, types.Bool])) {
        throw new exceptions.TypeError.$pyclass("'" + type_name(args[0]) + "' object is not iterable")
    }
    if (types.isinstance(args[0], types.Bytearray) || (types.isinstance(args[0], types.Bytes) && args[0].val.length > 0) || (types.isinstance(args[0], types.Range) && args[0].length > 0) || (types.isinstance(args[0], types.FrozenSet) && args[0].data.size > 0)) {
        throw new exceptions.TypeError.$pyclass('cannot convert dictionary update sequence element #0 to a sequence')
    }
    var i
    if (types.isinstance(args[0], types.Set)) {
        for (i = 0; i < args[0].data.keys().length; i++) {
            var current_item = args[0].data.keys()[i]
            if (!types.isinstance(current_item, types.Tuple) || current_item.length !== 2) {
                throw new exceptions.TypeError.$pyclass('cannot convert dictionary update sequence element #0 to a sequence')
            }
        }
    }
    // if single bool case

    // if multiple bool case

    // handling keyword arguments and no arguments
    if (args.length === 0 || args[0].length === 0) {
        if (kwargs) {
            return new types.Dict(kwargs)
        } else {
            return new types.Dict()
        }
    } else {
        // iterate through array to find any errors
        for (i = 0; i < args[0].length; i++) {
            if (args[0][i].length !== 2) {
                // single number or bool in an iterable throws different error
                if (types.isinstance(args[0][i], [types.Bool, types.Int])) {
                    throw new exceptions.TypeError.$pyclass('cannot convert dictionary update sequence element #' + i + ' to a sequence')
                } else {
                    throw new exceptions.ValueError.$pyclass('dictionary update sequence element #' + i + ' has length ' + args[0][i].length + '; 2 is required')
                }
            }
        }
    }
    // Passing a dictionary as argument
    if (types.isinstance(args[0], types.Dict)) {
        return args[0]
    }

    // passing a list as argument
    if (args.length === 1) {
        var args0 = new types.List(args[0])

        var dict = new types.Dict()
        for (i = 0; i < args0.length; i++) {
            var sub_array = args0[i]

            if (sub_array.length === 2) {
                dict.__setitem__(sub_array[0], sub_array[1])
            }
        }
        return new types.Dict(dict)
    }
}
dict.__doc__ = "dict() -> new empty dictionary\ndict(mapping) -> new dictionary initialized from a mapping object's\n    (key, value) pairs\ndict(iterable) -> new dictionary initialized as if via:\n    d = {}\n    for k, v in iterable:\n        d[k] = v\ndict(**kwargs) -> new dictionary initialized with the name=value pairs\n    in the keyword argument list.  For example:  dict(one=1, two=2)"

module.exports = dict
