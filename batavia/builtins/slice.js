var types = require('../types')

function slice(args, kwargs) {
    if (args.length === 1) {
        return new types.Slice({
            start: new types.Int(0),
            stop: args[0],
            step: new types.Int(1)
        })
    } else {
        return new types.Slice({
            start: args[0],
            stop: args[1],
            step: new types.Int(args[2] || 1)
        })
    }
}
slice.__doc__ = 'slice(stop)\nslice(start, stop[, step])\n\nCreate a slice object.  This is used for extended slicing (e.g. a[0:10:2]).'

module.exports = slice
