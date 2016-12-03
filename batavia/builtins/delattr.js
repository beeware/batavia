var exceptions = require('../core').exceptions;
var getattr = require('./getattr');
var types = require('../types');


function delattr(args, kwargs) {
    if (args) {
        try {
            if (getattr(args)) {
                delete args[0][args[1]];
                // False returned by bool(delattr(...)) in the success case
                // TODO (JC): this is wrong, because delattr() returns None
                // TODO       ask where/how to set up a failing test before fixing
                return new types.Bool(false);
            }
        } catch (err) {
            // This is maybe unecessary, but matches the error thrown by python 3.5.1 in this case
            if (err instanceof exceptions.AttributeError) {
                throw new exceptions.AttributeError(args[1]);
            }
            if (err instanceof exceptions.TypeError) {
                throw new exceptions.TypeError("delattr expected 2 arguments, got " + args.length);
            }
        }
    } else {
        throw new exceptions.TypeError("delattr expected 2 arguments, got 0");
    }
}
delattr.__doc__ = "delattr(object, name)\n\nDelete a named attribute on an object; delattr(x, 'y') is equivalent to\n``del x.y''.";

module.exports = delattr;
