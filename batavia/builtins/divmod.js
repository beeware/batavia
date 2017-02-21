var exceptions = require('../core').exceptions
var types = require('../types')

function divmod(args, kwargs) {
    if (arguments.length !== 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass("divmod() doesn't accept keyword arguments")
    }
    if (!args || args.length !== 2) {
        throw new exceptions.TypeError.$pyclass('divmod() expected exactly 2 argument (' + args.length + ' given)')
    }

    var div = Math.floor(args[0] / args[1])
    var rem = args[0] % args[1]
    return new types.Tuple([new types.Int(div), new types.Int(rem)])
}
divmod.__doc__ = 'Return the tuple ((x-x%y)/y, x%y).  Invariant: div*y + mod === x.'

module.exports = divmod
