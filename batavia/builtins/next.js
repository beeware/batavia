var exceptions = require('../core').exceptions
var callables = require('../core').callables
var type_name = require('../core').type_name

function next(args, kwargs) {
    // if its iterable return next thing in iterable
    // else stop iteration
    if (arguments.length !== 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass('next() takes no keyword arguments')
    }
    if (!args || args.length === 0) {
        throw new exceptions.TypeError.$pyclass('next expected at least 1 arguments, got 0')
    }
    if (args.length > 2) {
        throw new exceptions.TypeError.$pyclass('next expected at most 2 arguments, got ' + args.length)
    }

    try {
        return callables.call_method(args[0], '__next__', [])
    } catch (e) {
        if (e instanceof exceptions.StopIteration.$pyclass) {
            if (args.length === 2) {
                return args[1]
            } else {
                throw e
            }
        } else {
            throw new exceptions.TypeError.$pyclass("'" + type_name(args[0]) + "' object is not an iterator")
        }
    }
}
next.__doc__ = 'next(iterator[, default])\n\nReturn the next item from the iterator. If default is given and the iterator\nis exhausted, it is returned instead of raising StopIteration.'

module.exports = next
