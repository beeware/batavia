var exceptions = require('../core').exceptions
var types = require('../types')

function map(args, kwargs) {
    if (arguments.length !== 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.')
    }

    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass("map() doesn't accept keyword arguments")
    }

    if (!args || args.length < 2) {
        throw new exceptions.TypeError.$pyclass('map() must have at least two arguments.')
    }

    return new types.Map(args, kwargs)
}
map.__doc__ = 'map(func, *iterables) --> map object\n\nMake an iterator that computes the function using arguments from\neach of the iterables.  Stops when the shortest iterable is exhausted.'

module.exports = map
