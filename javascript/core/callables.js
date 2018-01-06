import { PyStopIteration } from './exceptions'
import * as native from './native'

/********************
 * Invoking functions
 ********************/

export function call_function(func, args, kwargs) {
    if (func.__call__) {
        func = func.__call__.bind(func)
    }

    var retval = func(args, kwargs)
    return retval
}

/******************
 * Invoking methods
 ******************/

export function call_method(obj, method_name, args, kwargs) {
    var method
    if (obj.__getattribute__ === undefined) {
        // No __getattribute__(), so it's a native object.
        method = native.getattr(obj, method_name)
    } else {
        method = native.getattr_py(obj, method_name)
    }

    var retval = call_function(method, args, kwargs)
    return retval
}

/************************
 * Working with iterables
 ************************/

// Iterate a python iterable to completion,
// calling a javascript callback on each item that it yields.
export function iter_for_each(iterobj, callback) {
    try {
        while (true) {
            var next = call_method(iterobj, '__next__', [])
            callback(next)
        }
    } catch (err) {
        if (!(err instanceof PyStopIteration)) {
            throw err
        }
    }
}
