import { pyAttributeError, pyPolyglotError, pyStopIteration, pyTypeError } from './exceptions'

import * as types from '../types'

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
 *         default_args: ['myarg3']
 *         varargs: 'myargs',
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
    let self, callable, name, pyargs, arg, index, err

    // This is really a call to getattr, but circular dependencies...
    try {
        callable = func.__call__
    } catch (e) {
        if (!types.isinstance(e, pyAttributeError)) {
            throw e
        }
    }

    // If the function has a __call__ method, use it;
    // otherwise, treat the object as a function as-is.
    if (callable) {
        self = func
    } else {
        callable = func
        self = vm
    }

    pyargs = callable.$pyargs
    // Make sure every callable has a name
    if (func.__name__ === undefined) {
        name = func.name
    } else {
        name = func.__name__
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
            for (index in pyargs.args) {
                arg = args[index]
                if (arg === undefined) {
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

                    throw pyTypeError(
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
            for (index in pyargs.default_args) {
                js_args.push(args[parseInt(index) + n_args])
            }
            n_args += pyargs.default_args.length
        }

        // Variable arguments
        if (pyargs.varargs) {
            js_args.push(args.slice(js_args.length))
        } else if (args.length > n_args) {
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
                    err = (e) => `${e.name}() takes no arguments (${e.given} given)`
                }
            }

            throw pyTypeError(
                err({
                    'name': name,
                    'nargs': n_args,
                    'given': args.length
                })
            )
        }

        // kwonly arguments
        if (pyargs.kwonlyargs) {
            for (index in pyargs.kwonlyargs) {
                arg = pyargs.kwonlyargs[index]
                js_args.push(kw[arg])
                delete kw[arg]
            }
        }

        // kw arguments
        if (pyargs.kwargs) {
            js_args.push(kw)
        } else {
            for (arg of Object.getOwnPropertyNames(kw)) {
                if (pyargs.invalid_keyword_error) {
                    err = pyargs.invalid_keyword_error
                } else {
                    err = (e) => `${e.name}() got an unexpected keyword argument '${e.arg}'`
                }

                throw pyTypeError(
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
            throw pyPolyglotError("Can't pass kwargs to native Javascript function")
        }
        js_args = args
    }

    return callable.apply(self, js_args)
}

/*************************************************************************
 * Working with iterables
 *************************************************************************/

// Iterate a python iterable to completion,
// calling a javascript callback on each item that it yields.
export function iter_for_each(iterobj, callback) {
    try {
        while (true) {
            callback(iterobj.__next__())
        }
    } catch (err) {
        if (!(types.isinstance(err, pyStopIteration))) {
            throw err
        }
    }
}
