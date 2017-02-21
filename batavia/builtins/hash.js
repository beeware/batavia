var exceptions = require('../core').exceptions
var callables = require('../core').callables
var type_name = require('../core').type_name
var types = require('../types')

function hash(args, kwargs) {
    if (arguments.length !== 2) {
        throw new exceptions.BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError.$pyclass("hash() doesn't accept keyword arguments")
    }
    if (!args || args.length !== 1) {
        throw new exceptions.TypeError.$pyclass('hash() expected exactly 1 argument (' + args.length + ' given)')
    }
    var arg = args[0]
    // None
    if (arg === null) {
        return 278918143
    }
    if (types.isinstance(arg, [types.Bytearray, types.Dict, types.JSDict, types.List, types.Set, types.Slice])) {
        throw new exceptions.TypeError.$pyclass("unhashable type: '" + type_name(arg) + "'")
    }
    if (typeof arg.__hash__ !== 'undefined') {
        return arg.__hash__()
    }
    // Use JS toString() to do a simple default hash, for now.
    // (This is similar to how JS objects work.)
    return new types.Str(arg.toString()).__hash__()
}
hash.__doc__ = 'hash(object) -> integer\n\nReturn a hash value for the object.  Two objects with the same value have\nthe same hash value.  The reverse is not necessarily true, but likely.'

module.exports = hash
