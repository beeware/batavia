var exceptions = require('./exceptions')
var native = require('./native')

var callables = {}

/********************
 * Invoking functions
 ********************/

callables.call_function = function(func, args, kwargs) {
    if (func.__call__) {
        func = func.__call__
    }

    var retval = func(args, kwargs)
    return retval
}

/******************
 * Invoking methods
 ******************/

callables.call_method = function(obj, method_name, args, kwargs) {
    var method
    if (obj.__getattribute__ === undefined) {
        // No __getattribute__(), so it's a native object.
        method = native.getattr(obj, method_name)
    } else {
        if (obj.__class__ !== undefined) {
            var types = require('../types')
            if (obj.__class__.__getattribute__(obj, '__getattribute__') instanceof types.Method) {
                method = obj.__class__.__getattribute__(obj, '__getattribute__').__call__(method_name)
            } else {
                method = obj.__class__.__getattribute__(obj, method_name)
            }
        } else {
            method = obj.__getattribute__(method_name)
        }
    }

    var retval = callables.call_function(method, args, kwargs)
    return retval
}

/************************
 * Working with iterables
 ************************/

// Iterate a python iterable to completion,
// calling a javascript callback on each item that it yields.
callables.iter_for_each = function(iterobj, callback) {
    try {
        while (true) {
            var next = callables.call_method(iterobj, '__next__', [])
            callback(next)
        }
    } catch (err) {
        if (!(err instanceof exceptions.StopIteration.$pyclass)) {
            throw err
        }
    }
}

module.exports = callables
