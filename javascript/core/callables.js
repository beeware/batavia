import { PolyglotError, StopIteration, TypeError } from './exceptions'
import * as attrs from './attrs'
import { PyNone } from './types'

/*************************************************************************
 * Decorate the Python argument requirements of a function
 *************************************************************************/

export function raw() {
    return function (target, key, descriptor) {
        descriptor.value.$pyraw = true
        return descriptor
    }
}

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
    let callable
    if (func.__call__) {
        callable = attrs.getattr(func, '__call__')
    } else {
        callable = func
    }

    let js_args = []
    if (callable.$pyraw) {
        js_args = [args, kwargs]
        self = func
    } else if (callable.$pyargs) {
        // if (kwargs && Object.keys(kwargs).length > 0) {
        //     throw new TypeError(callable.name + "() doesn't accept keyword arguments")
        // }

        let kw = Object.assign({}, kwargs)
        // Positional arguments
        if (callable.$pyargs.args) {
            for (let index in callable.$pyargs.args) {
                let arg = args[index]
                if (arg === undefined) {
                    let msg
                    if (callable.$pyargs.default_args || callable.$pyargs.varargs) {
                        msg = 'at least'
                    } else {
                        msg = 'exactly'
                    }

                    if (index == 0) {
                        throw new TypeError(callable.name + '() takes ' + msg + ' one argument (' + args.length + ' given)')
                    } else {
                        throw new TypeError(callable.name + '() takes ' + msg + ' ' + callable.$pyargs.args.length + ' arguments (' + args.length + ' given)')
                    }
                } else {
                    js_args.push(args[index])
                }
            }
        }

        // Positional arguments with default values
        if (callable.$pyargs.default_args) {
            let n_args = js_args.length
            for (let index in callable.$pyargs.default_args) {
                js_args.push(args[parseInt(index) + n_args])
            }
        }

        // Variable arguments
        if (callable.$pyargs.varargs) {
            js_args.push(args.slice(js_args.length))
        }

        // kwonly arguments
        if (callable.$pyargs.kwonlyargs) {
            for (let index in callable.$pyargs.kwonlyargs) {
                let arg = callable.$pyargs.kwonlyargs[index]
                js_args.push(kw[arg])
                delete kw[arg]
            }
        }

        // kw arguments
        if (callable.$pyargs.kwargs) {
            js_args.push(kw)
        }

    } else {
        if (kwargs && Object.getOwnPropertyNames(kwargs).length > 0) {
            throw new PolyglotError("Can't pass kwargs to native Javascript function")
        }
        js_args = args
    }

    let retval = callable.apply(self, js_args)
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
