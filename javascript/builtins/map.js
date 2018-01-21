import * as types from '../types'

export default function map(func, iterables) {
    return new types.PyMap(func, iterables)
}

map.__name__ = 'map'
map.__doc__ = `map(func, *iterables) --> map object

Make an iterator that computes the function using arguments from
each of the iterables.  Stops when the shortest iterable is exhausted.`
map.$pyargs = {
    args: ['func'],
    varargs: 'iterables'
}
