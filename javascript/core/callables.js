import { PolyglotError, StopIteration, TypeError } from './exceptions'
import * as attrs from './attrs'
import { PyNone } from './types'

/*************************************************************************
 * Decorate the Python argument requirements of a function
 *************************************************************************/

export function python(pyargs) {
    return function (target, key, descriptor) {
        descriptor.value.$pyargs = pyargs
        return descriptor
    }
}

/*************************************************************************
 * Invoking functions
 *************************************************************************/

export function call_function(self, func, args=[], kwargs={}) {
    if (func.__call__) {
        func = attrs.getattr(func, '__call__')
    }

    let js_args = []
    if (func.$pyargs) {
        // if (kwargs && Object.keys(kwargs).length > 0) {
        //     throw new TypeError(func.name + "() doesn't accept keyword arguments")
        // }
        // if (func.$pyargs.args && args.length !== func.$pyargs.args.length) {
        //     throw new TypeError(func.name + '() takes exactly one argument (' + args.length + ' given)')
        // }

        let kw = Object.assign({}, kwargs)

        // Positional arguments
        if (func.$pyargs.args) {
            for (let index in func.$pyargs.args) {
                js_args.push(args[index])
            }
        }

        // Positional arguments with default values
        if (func.$pyargs.default_args) {
            let n_args = js_args.length
            for (let index in func.$pyargs.default_args) {
                js_args.push(args[index + n_args])
            }
        }

        // Variable arguments
        if (func.$pyargs.varargs) {
            js_args.push(args.slice(js_args.length))
        }

        // kwonly arguments
        if (func.$pyargs.kwonlyargs) {
            for (let index in func.$pyargs.kwonlyargs) {
                let arg = func.$pyargs.kwonlyargs[index]
                js_args.push(kw[arg])
                delete kw[arg]
            }
        }

        // kw arguments
        if (func.$pyargs.kwargs) {
            js_args.push(kw)
        }

    } else {
        if (kwargs && Object.getOwnPropertyNames(kwargs).length > 0) {
            throw new PolyglotError("Can't pass kwargs to native Javascript function")
        }
        js_args = args
    }

    let retval = func.apply(self, js_args)
    return retval
}

/*************************************************************************
 * Invoking methods
 *************************************************************************/

export function call_method(obj, method_name, args, kwargs) {
    var method = attrs.getattr(obj, method_name)
    var retval = call_function(obj, method, args, kwargs)
    return retval
}

/*************************************************************************
 * Invoking methods on super
 *************************************************************************/

export function call_super(obj, method_name, args, kwargs) {
    for (let base of obj.__class__.mro().slice(1)) {
        let super_method = base.$pyclass.prototype[method_name]
        if (super_method) {
            let retval = call_function(obj, super_method, args, kwargs)
            return retval
        }
    }
}
/*************************************************************************
 * Working with iterables
 *************************************************************************/

// Iterate a python iterable to completion,
// calling a javascript callback on each item that it yields.
export function iter_for_each(iterobj, callback) {
    try {
        while (true) {
            var next = call_method(iterobj, '__next__')
            callback(next)
        }
    } catch (err) {
        if (!(err instanceof StopIteration)) {
            throw err
        }
    }
}
