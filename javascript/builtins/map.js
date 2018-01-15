import { BataviaError, TypeError } from '../core/exceptions'
import * as types from '../types'

export default function map(func, iterables) {
    return new types.PyMap(func, iterables)
}

map.__doc__ = 'map(func, *iterables) --> map object\n\nMake an iterator that computes the function using arguments from\neach of the iterables.  Stops when the shortest iterable is exhausted.'
map.$pyargs = {
    args: ['func'],
    varargs: 'iterables'
}
