import { PyTypeError } from '../core/exceptions'

import { PyNone } from '../builtins'
import * as types from '../types'

export default function slice(args, kwargs) {
    if (!args || args.length === 0) {
        throw new PyTypeError('slice expected at least 1 arguments, got 0')
    } else if (args.length === 1) {
        return new types.PySlice({
            start: PyNone,
            stop: args[0],
            step: PyNone
        })
    } else if (args.length === 2) {
        return new types.PySlice({
            start: args[0],
            stop: args[1],
            step: PyNone
        })
    } else if (args.length === 3) {
        return new types.PySlice({
            start: args[0],
            stop: args[1],
            step: args[2]
        })
    } else {
        throw new PyTypeError('slice expected at most 3 arguments, got ' + args.length)
    }
}

slice.__doc__ = 'slice(stop)\nslice(start, stop[, step])\n\nCreate a slice object.  This is used for extended slicing (e.g. a[0:10:2]).'
slice.$pyargs = true
