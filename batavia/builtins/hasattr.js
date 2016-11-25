var exceptions = require('../core').exceptions;
var getattr = require('./getattr');

var hasattr = function(args) {
    if (args) {
        try {
            if (getattr(args)) {
                return true;
            }
        } catch (err) {
            if (err instanceof exceptions.AttributeError) {
                return false;
            }
            if (err instanceof exceptions.TypeError) {
                throw new exceptions.TypeError("hasattr expected 2 arguments, got " + args.length);
            }
        }
    } else {
        throw new exceptions.TypeError("hasattr expected 2 arguments, got 0");
    }
};
hasattr.__doc__ = 'hasattr(object, name) -> bool\n\nReturn whether the object has an attribute with the given name.\n(This is done by calling getattr(object, name) and catching AttributeError.)';

module.exports = hasattr;
