import * as attrs from './attrs'
import { PolyglotError, StopIteration, TypeError } from './exceptions'
import { PyType } from './types'

/*************************************************************************
 * Decorate the Python argument requirements of a function
 *
 * A "raw" function is a function that follows the internal Python
 * format for arguments:
 *
 *     @pyargs(null)
 *     function(args, kwargs) {}
 *
 * A "Python" function is a normal javascript function, but with extra
 * annotation so that keyword arguments provided by Python can be aligned
 * with their position in Javascript. It allows you to define a Javascript
 * function:
 *
 *     @pyargs({
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

export function pyargs(pyargs) {
    return function(target, key, descriptor) {
        descriptor.value.$pyargs = pyargs
        return descriptor
    }
}

/*************************************************************************
 * Invoking functions
 *************************************************************************/

export function call_function(vm, func, args = [], kwargs = {}) {
    let callable, pyargs, name
    let self = vm
    if (func instanceof PyType) {
        // The function is a type.
        // The constructor will be an annotated javascript function if it is
        // a builtin; otherwise, it will be defined in bytecode, and require
        // raw python arguments.
        callable = func.__call__
        self = func
        if (func.$builtin) {
            pyargs = func.$pyclass.prototype.__init__.$pyargs
        } else {
            pyargs = null
        }

        // Make sure every callable has a name
        // Use the name of the class
        name = func.__name__
    } else if (func.$pytype) {
        callable = (function(Type) {
            let pytype = function() {
                return new Type(...arguments)
            }

            Type.__class__ = pytype

            // Use the name of the function if a name hasn't been
            // explicitly provided
            if (Type.__name__ === undefined) {
                pytype.__name__ = Type.name
            } else {
                pytype.name = Type.__name__
            }
            return pytype
        })(func)
        name = callable.name
    } else if (func.__call__) {
        // The function is a callable object. Get the call method.
        callable = attrs.getattr(func, '__call__')
        pyargs = callable.$pyargs

        // Make sure every callable has a name
        // Use the name of the callable, not the call method
        if (callable.__name__ === undefined) {
            name = func.name
        } else {
            name = func.__name__
        }
    } else {
        // The function is a function. Call it as-is.
        callable = func
        pyargs = callable.$pyargs

        // Make sure every callable has a name
        if (callable.__name__ === undefined) {
            name = callable.name
        } else {
            name = callable.__name__
        }
    }

    let js_args = []
    if (pyargs === null) {
        js_args = [args, kwargs]
        self = func
    } else if (pyargs !== undefined) {
        let n_args = 0
        let kw = Object.assign({}, kwargs)
        // Positional arguments
        if (pyargs.args) {
            for (let index in pyargs.args) {
                let arg = args[index]
                if (arg === undefined) {
                    let err
                    if (pyargs.missing_args_error) {
                        err = pyargs.missing_args_error
                    } else if (pyargs.args.length === 1) {
                        if (pyargs.default_args || pyargs.varargs) {
                            err = (e) => `${e.name}() takes at least one argument (${e.given} given)`
                        } else {
                            err = (e) => `${e.name}() takes exactly one argument (${e.given} given)`
                        }
                    } else {
                        if (pyargs.default_args || pyargs.varargs) {
                            err = (e) => `${e.name}() takes at least ${e.nargs} arguments (${e.given} given)`
                        } else {
                            err = (e) => `${e.name}() takes exactly ${e.nargs} arguments (${e.given} given)`
                        }
                    }

                    throw new TypeError(
                        err({
                            'name': name,
                            'nargs': pyargs.args.length,
                            'arg': pyargs.args[index],
                            'argpos': parseInt(index) + 1,
                            'given': args.length
                        })
                    )
                } else {
                    js_args.push(args[index])
                }
            }
            n_args = js_args.length
        }

        // Positional arguments with default values
        if (pyargs.default_args) {
            for (let index in pyargs.default_args) {
                js_args.push(args[parseInt(index) + n_args])
            }
            n_args += pyargs.default_args.length
        }

        // Variable arguments
        if (pyargs.varargs) {
            js_args.push(args.slice(js_args.length))
        } else if (args.length > n_args) {
            let err
            if (pyargs.surplus_args_error) {
                err = pyargs.surplus_args_error
            } else if (pyargs.args) {
                if (pyargs.default_args) {
                    err = (e) => `${e.name}() expects at most ${e.nargs} arguments (${e.given} given)`
                } else {
                    err = (e) => `${e.name}() expects ${e.nargs} arguments (${e.given} given)`
                }
            } else {
                if (pyargs.default_args) {
                    err = (e) => `${e.name}() expects at most ${e.nargs} arguments (${e.given} given)`
                } else {
                    err = (e) => `${e.name}() takes no arguments (${e.given})`
                }
            }

            throw new TypeError(
                err({
                    'name': name,
                    'nargs': n_args,
                    'given': args.length
                })
            )
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
        } else {
            for (let arg in Object.getOwnPropertyNames(kw)) {
                let err
                if (pyargs.invalid_keyword_error) {
                    err = pyargs.invalid_keyword_error
                } else {
                    err = (e) => `${e.name}() got an unexpected keyword argument '${e.arg}'`
                }

                throw new TypeError(
                    err({
                        'name': callable.__name__,
                        'nargs': n_args,
                        'arg': arg
                    })
                )
            }
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
