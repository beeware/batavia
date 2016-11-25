var exceptions = require('../core').exceptions;

var setattr = function(args) {
    if (args.length !== 3) {
        throw new exceptions.TypeError("setattr expected exactly 3 arguments, got " + args.length);
    }

    args[0][args[1]] = args[2];
};
setattr.__doc__ = "setattr(object, name, value)\n\nSet a named attribute on an object; setattr(x, 'y', v) is equivalent to\n``x.y = v''.";

module.exports = setattr;
