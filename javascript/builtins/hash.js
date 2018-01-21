import { TypeError } from '../core/exceptions'
import { type_name } from '../core/types'

import * as types from '../types'

export default function hash(object) {
    // Hash of a Javascript "null" is a fixed value
    if (object === null) {
        return 278918143
    }
    if (types.isinstance(object, [types.PyBytearray, types.PyDict, types.JSDict, types.PyList, types.PySet, types.PySlice])) {
        throw new TypeError("unhashable type: '" + type_name(object) + "'")
    }
    if (object.__hash__ !== undefined) {
        return object.__hash__()
    }
    // Use JS toString() to do a simple default hash, for now.
    // (This is similar to how JS objects work.)
    return new types.PyStr(object.toString()).__hash__()
}

hash.__name__ = 'hash'
hash.__doc__ = `hash(object) -> integer

Return a hash value for the object.  Two objects with the same value have
the same hash value.  The reverse is not necessarily true, but likely.`
hash.$pyargs = {
    args: ['object']
}
