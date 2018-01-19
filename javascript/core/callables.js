import { PolyglotError, StopIteration, TypeError } from './exceptions'
import * as attrs from './attrs'
import { PyNone, PyType } from './types'

/*************************************************************************
 * Decorate the Python argument requirements of a function
 *
 * A "raw" function is a function that follows the internal Python
 * format for arguments:
 *
 *     @python(null)
 *     function(args, kwargs) {}
 *
 * A "Python" function is a normal javascript function, but with extra
 * annotation so that keyword arguments provided by Python can be aligned
 * with their position in Javascript. It allows you to define a Javascript
 * function:
 *
 *     @python({
 *         args: ['myarg1', 'myarg2'],
 *         defaultargs: ['myarg3']
 *         varargs: myargs,
 *         kwonlyargs: ['mykw1', 'mykw2'],
 *         kwargs: 'mykws'
 *     })
 *     function(myarg1, myarg2, myarg3, myargs, mykw1, mykw2, mykws) {}
 *
 * which corresponds to the Python function:
 *
 *     def myfunc(myarg1, myarg2, myarg3=30, *myargs, mykw1=10, mykw=20, **mykws):
 *
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
    let callable, pyargs

    if (func instanceof PyType) {
        // The function is a type.
        // The constructor will be an annotated javascript function if it is
        // a builtin; otherwise, it will be defined in bytecode, and require
        // raw python arguments.
        callable = func.__call__
        if (func.$builtin) {
            pyargs = func.$pyclass.prototype.__init__.$pyargs
        } else {
            pyargs = null
        }
    } else if (func.__call__) {
        // The function is a callable object. Get the call method.
        callable = attrs.getattr(func, '__call__')
        pyargs = callable.$pyargs
    } else {
        // The function is a function. Call it as-is.
        callable = func
        pyargs = callable.$pyargs
    }

    let js_args = []
    if (pyargs === null) {
        js_args = [args, kwargs]
        self = func
    } else if (pyargs) {
        // if (kwargs && Object.keys(kwargs).length > 0) {
        //     throw new TypeError(callable.name + "() doesn't accept keyword arguments")
        // }

        let kw = Object.assign({}, kwargs)
        // Positional arguments
        if (pyargs.args) {
            for (let index in pyargs.args) {
                let arg = args[index]
                if (arg === undefined) {
                    let msg
                    if (pyargs.default_args || pyargs.varargs) {
                        msg = 'at least'
                    } else {
                        msg = 'exactly'
                    }

                    if (index == 0) {
                        throw new TypeError(callable.name + '() takes ' + msg + ' one argument (' + args.length + ' given)')
                    } else {
                        throw new TypeError(callable.name + '() takes ' + msg + ' ' + pyargs.args.length + ' arguments (' + args.length + ' given)')
                    }
                } else {
                    js_args.push(args[index])
                }
            }
        }

        // Positional arguments with default values
        if (pyargs.default_args) {
            let n_args = js_args.length
            for (let index in pyargs.default_args) {
                js_args.push(args[parseInt(index) + n_args])
            }
        }

        // Variable arguments
        if (pyargs.varargs) {
            js_args.push(args.slice(js_args.length))
        }

        // kwonly arguments
        if (pyargs.kwonlyargs) {
            for (let index in pyargs.kwonlyargs) {
                let arg = pyargs.kwonlyargs[index]
                js_args.push(kw[arg])
                delete kw[arg]
            }
        }

        // kw arguments
        if (pyargs.kwargs) {
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
    let method = attrs.getattr(obj, method_name)
    let retval = call_function(obj, method, args, kwargs)
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
            callback(call_method(iterobj, '__next__'))
        }
    } catch (err) {
        if (!(err instanceof StopIteration)) {
            throw err
        }
    }
}
