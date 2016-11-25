var exceptions = require('../core').exceptions;
var types = require('../types');

var hash = function(args, kwargs) {
    if (arguments.length != 2) {
        throw new exceptions.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError("hash() doesn't accept keyword arguments");
    }
    if (!args || args.length != 1) {
        throw new exceptions.TypeError('hash() expected exactly 1 argument (' + args.length + ' given)');
    }
    var arg = args[0];
    // None
    if (arg === null) {
        return 278918143;
    }
    if (types.isinstance(arg, [types.Bytearray, types.Dict, types.JSDict, types.List, types.Set, types.Slice])) {
        throw new exceptions.TypeError("unhashable type: '" + type_name(arg) + "'");
    }
    if (typeof arg.__hash__ !== 'undefined') {
        return callables.run_callable(arg, arg.__hash__, [], null);
    }
    // Use JS toString() to do a simple default hash, for now.
    // (This is similar to how JS objects work.)
    return new types.Str(arg.toString()).__hash__();
};
hash.__doc__ = 'hash(object) -> integer\n\nReturn a hash value for the object.  Two objects with the same value have\nthe same hash value.  The reverse is not necessarily true, but likely.';

module.exports = hash;
