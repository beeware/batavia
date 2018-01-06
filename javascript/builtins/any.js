import { call_method } from '../core/callables'
import { BataviaError, PyStopIteration, PyTypeError } from '../core/exceptions'
import { type_name } from '../core/types'

export default function any(args, kwargs) {
    if (args[0] === null) {
        throw new PyTypeError("'NoneType' object is not iterable")
    }
    if (arguments.length !== 2) {
        throw new BataviaError('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new PyTypeError("any() doesn't accept keyword arguments")
    }
    if (!args || args.length !== 1) {
        throw new PyTypeError('any() takes exactly one argument (' + args.length + ' given)')
    }

    if (!args[0].__iter__) {
        throw new PyTypeError("'" + type_name(args[0]) + "' object is not iterable")
    }

    var iterobj = call_method(args[0], '__iter__', [])
    try {
        while (true) {
            var next = call_method(iterobj, '__next__', [])
            var bool_next = call_method(next, '__bool__', [])
            if (bool_next) {
                return true
            }
        }
    } catch (err) {
        if (!(err instanceof PyStopIteration)) {
            throw err
        }
    }
    return false
}

any.__doc__ = 'any(iterable) -> bool\n\nReturn True if bool(x) is True for any x in the iterable.\nIf the iterable is empty, return False.'
any.$pyargs = true
