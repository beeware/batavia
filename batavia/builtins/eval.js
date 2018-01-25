var exceptions = require('../core').exceptions
var types = require('../types')

function eval_(args, kwargs) {
    if (arguments.length !== 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass("eval() doesn't accept keyword arguments")
    }
    if (args.length === 0) {
        throw new exceptions.TypeError.$pyclass('eval expected at least 1 arguments, got 0')
    }
    if (!types.isinstance(args[0], [types.Str, types.Bytes, types.Bytearray, types.Code])) {
        throw new exceptions.TypeError.$pyclass('eval() arg 1 must be a string, bytes or code object')
    }

    throw new exceptions.NotImplementedError.$pyclass('eval() is not yet implemented in batavia.')
}
eval_.__doc__ = 'eval(source[, globals[, locals]]) -> value\n\nEvaluate the source in the context of globals and locals.\nThe source may be a string representing a Python expression\nor a code object as returned by compile().\nThe globals must be a dictionary and locals can be any mapping,\ndefaulting to the current globals and locals.\nIf only globals is given, locals defaults to it.\n'

module.exports = eval_
