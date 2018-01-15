import { call_method } from '../core/callables'
import { BataviaError, StopIteration, TypeError } from '../core/exceptions'
import { type_name } from '../core/types'

export default function next(args, kwargs) {
    // if its iterable return next thing in iterable
    // else stop iteration
    if (arguments.length !== 2) {
        throw new BataviaError('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new TypeError('next() takes no keyword arguments')
    }
    if (!args || args.length === 0) {
        throw new TypeError('next expected at least 1 arguments, got 0')
    }
    if (args.length > 2) {
        throw new TypeError('next expected at most 2 arguments, got ' + args.length)
    }

    try {
        return call_method(args[0], '__next__', [])
    } catch (e) {
        if (e instanceof StopIteration) {
            if (args.length === 2) {
                return args[1]
            } else {
                throw e
            }
        } else {
            throw new TypeError("'" + type_name(args[0]) + "' object is not an iterator")
        }
    }
}

next.__doc__ = 'next(iterator[, default])\n\nReturn the next item from the iterator. If default is given and the iterator\nis exhausted, it is returned instead of raising StopIteration.'
next.$pyargs = true
