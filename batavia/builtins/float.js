var exceptions = require('../core').exceptions;
var types = require('../types');


function float(args, kwargs) {
    if (args.length > 1) {
        throw new exceptions.TypeError("float() takes at most 1 argument (" + args.length + " given)");
    }
    if (args.length === 0) {
        return new types.Float(0.0);
    }

    var value = args[0];

    if (types.isinstance(value, types.Str)) {
        if (value.search(/[^0-9.]/g) === -1) {
            return new types.Float(parseFloat(value));
        } else {
            if (value === "nan" || value === "+nan" || value === "-nan") {
                return new types.Float(NaN);
            } else if (value === "inf" || value === "+inf") {
                return new types.Float(Infinity);
            } else if (value === "-inf") {
                return new types.Float(-Infinity);
            }
            throw new exceptions.ValueError("could not convert string to float: '" + args[0] + "'");
        }
    } else if (types.isinstance(value, [types.Int, types.Bool, types.Float])) {
        return args[0].__float__();
    }
}
float.__doc__ = 'float([x]) -> Convert a string or a number to floating point.';

module.exports = float;
