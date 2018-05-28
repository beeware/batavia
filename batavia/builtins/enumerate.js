var exceptions = require('../core').exceptions
var types = require('../types')
var type_name = require('../core').type_name

function enumerate(args, kwargs) {
    if (arguments.length !== 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass("enumerate() doesn't accept keyword arguments")
    }
    if (args.length < 1) {
        throw new exceptions.TypeError.$pyclass('Required argument \'iterable\' (pos 1) not found')
    }
    if (!args[0].__iter__) {
        throw new exceptions.TypeError.$pyclass('\'' + type_name(args[0]) + '\' object is not iterable')
    }
    return new types.Enumerate(args[0])
}
enumerate.__doc__ = 'enumerate(iterable[, start]) -> iterator for index, value of iterable\n\nReturn an enumerate object.  iterable must be another object that supports\niteration.  The enumerate object yields pairs containing a count (from\nstart, which defaults to zero) and a value yielded by the iterable argument.\nenumerate is useful for obtaining an indexed list:\n    (0, seq[0]), (1, seq[1]), (2, seq[2]), ...'

module.exports = enumerate
