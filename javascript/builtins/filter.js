import { BataviaError, TypeError } from '../core/exceptions'

import * as types from '../types'

export default function filter(args, kwargs) {
    if (args.length !== 2) {
        throw new BataviaError('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new TypeError("filter() doesn't accept keyword arguments")
    }

    if (args[1].__iter__ === undefined) {
        throw new TypeError("'" + args[1].__class__.__name__ + "' object is not iterable")
    }
    return new types.PyFilter(args, kwargs)
}
filter.__doc__ = 'filter(export default function or None, iterable) --> filter object\n\nReturn an iterator yielding those items of iterable for which function(item)\nis true. If function is None, return the items that are true.'
filter.$pyargs = true
