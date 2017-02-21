var exceptions = require('../core').exceptions
var types = require('../types')

function _validateInput(args, kwargs, undefined) {
    var bigger = 1
    var smaller = -1

    function preparingFunction(value) {
        return {
            'key': value,
            'value': value
        }
    }

    if (kwargs !== undefined) {
        if (kwargs['iterable'] !== undefined) {
            throw new exceptions.TypeError.$pyclass("'iterable' is an invalid keyword argument for this function")
        }

        if (kwargs['reverse'] !== undefined && kwargs['reverse'] === true) {
            bigger = -1
            smaller = 1
        }

        if (kwargs['key'] !== undefined) {
            // TODO: Fix context of python functions calling with proper vm
            throw new exceptions.NotImplementedError.$pyclass('Builtin Batavia sorted function "key" function is not implemented.')
            // preparingFunction = function (value) {
            //    return {
            //        "key": kwargs["key"].__call__.apply(kwargs["key"].$vm, [value], null),
            //        "value": value
            //    };
            // }
        }
    }

    if (args === undefined || args.length === 0) {
        throw new exceptions.TypeError.$pyclass("Required argument 'iterable' (pos 1) not found")
    }

    return {
        iterable: args[0],
        bigger: bigger,
        smaller: smaller,
        preparingFunction: preparingFunction
    }
}

function sorted(args, kwargs) {
    var validatedInput = _validateInput(args, kwargs)
    var iterable = validatedInput['iterable']

    if (types.isinstance(iterable, [types.List, types.Tuple])) {
        iterable = iterable.map(validatedInput['preparingFunction'])
        iterable.sort(function(a, b) {
            // TODO: Replace this with a better, guaranteed stable sort.
            // Javascript's default sort has performance problems in some
            // implementations and is not guaranteed to be stable, while
            // CPython's sorted is stable and efficient. See:
            // * https://docs.python.org/3/library/functions.html#sorted
            // * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
            if (a['key'].__gt__(b['key'])) {
                return validatedInput['bigger']
            }

            if (a['key'].__lt__(b['key'])) {
                return validatedInput['smaller']
            }
            return 0
        })

        return new types.List(iterable.map(function(element) {
            return element['value']
        }))
    }

    throw new exceptions.NotImplementedError.$pyclass("Builtin Batavia function 'sorted' not implemented for objects")
}
sorted.__doc__ = 'sorted(iterable, key=None, reverse=False) --> new sorted list'

module.exports = sorted
