var exceptions = require('../core').exceptions;
var types = require('../types');

var divmod = function(args, kwargs) {
    if (arguments.length != 2) {
        throw new exceptions.BataviaError('Batavia calling convention not used.');
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new exceptions.TypeError("divmod() doesn't accept keyword arguments");
    }
    if (!args || args.length != 2) {
        throw new exceptions.TypeError('divmod() expected exactly 2 argument (' + args.length + ' given)');
    }

    div = Math.floor(args[0]/args[1]);
    rem = args[0] % args[1];
    return new types.Tuple([new types.Int(div), new types.Int(rem)]);
};
divmod.__doc__ = 'Return the tuple ((x-x%y)/y, x%y).  Invariant: div*y + mod == x.';

module.exports = divmod;
