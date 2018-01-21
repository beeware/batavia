import { TypeError } from '../core/exceptions'

import * as types from '../types'

export default function filter(fn, iterable) {
    if (iterable.__iter__ === undefined) {
        throw new TypeError("'" + iterable.__class__.__name__ + "' object is not iterable")
    }
    return new types.PyFilter(fn, iterable)
}

filter.__doc__ = `filter(function or None, iterable) --> filter object
Return an iterator yielding those items of iterable for which function(item)
is true. If function is None, return the items that are true.`
filter.$pyargs = {
    args: ['fn', 'iterable']
}
