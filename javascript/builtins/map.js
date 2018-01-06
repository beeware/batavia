import { BataviaError, PyTypeError } from '../core/exceptions'
import * as types from '../types'

export default function map(args, kwargs) {
    if (arguments.length !== 2) {
        throw new BataviaError('Batavia calling convention not used.')
    }

    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new PyTypeError("map() doesn't accept keyword arguments")
    }

    if (!args || args.length < 2) {
        throw new PyTypeError('map() must have at least two arguments.')
    }

    return new types.PyMap(args, kwargs)
}

map.__doc__ = 'map(func, *iterables) --> map object\n\nMake an iterator that computes the function using arguments from\neach of the iterables.  Stops when the shortest iterable is exhausted.'
map.$pyargs = true
