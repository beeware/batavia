var exceptions = require('../core').exceptions
var callables = require('../core').callables
var type_name = require('../core').type_name
var types = require('../types')

var SequenceIterator = require('../types/SequenceIterator')

function iter(args, kwargs) {
    if (arguments.length !== 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass("iter() doesn't accept keyword arguments")
    }
    if (!args || args.length === 0) {
        throw new exceptions.TypeError.$pyclass('iter() expected at least 1 arguments, got 0')
    }
    if (args.length === 2) {
        return new types.CallableIterator(args[0], args[1])
    }
    if (args.length > 2) {
        throw new exceptions.TypeError.$pyclass('iter() expected at most 2 arguments, got 3')
    }

    if (args[0].__iter__) {
      return callables.call_method(args[0], '__iter__', [])
    }
    if (args[0].__len__ && args[0].__getitem__) {
      return new SequenceIterator(args[0])
    }

    throw new exceptions.TypeError.$pyclass("'" + type_name(args[0]) + "' object is not iterable")
}
iter.__doc__ = 'iter(iterable) -> iterator\niter(callable, sentinel) -> iterator\n\nGet an iterator from an object.  In the first form, the argument must\nsupply its own iterator, or be a sequence.\nIn the second form, the callable is called until it returns the sentinel.'

module.exports = iter
