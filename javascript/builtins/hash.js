import { pyTypeError } from '../core/exceptions'
import { type_name } from '../core/types'

import * as types from '../types'

export default function hash(object) {
    // Hash of a Javascript "null" is a fixed value
    if (object === null) {
        return 278918143
    }
    if (types.isinstance(object, [types.pybytearray, types.pydict, types.pylist, types.pyset, types.pyslice])) {
        throw pyTypeError("unhashable type: '" + type_name(object) + "'")
    }
    try {
        return object.__hash__()
    } catch (e) {
        // Use JS toString() to do a simple default hash, for now.
        // (This is similar to how JS objects work.)
        return object.__str__().__hash__()
    }
}

hash.__name__ = 'hash'
hash.__doc__ = `hash(object) -> integer

Return a hash value for the object.  Two objects with the same value have
the same hash value.  The reverse is not necessarily true, but likely.`
hash.$pyargs = {
    args: ['object']
}
