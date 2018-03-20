import { type_name } from '../core/types'
import { pyTypeError } from '../core/exceptions'

import { getattr } from '../builtins'

export default function len(object) {
    if (getattr(object, '__len__', null)) {
        return object.__len__()
    }

    throw pyTypeError(`object of type '${type_name(object)}' has no len()`)
}

len.__name__ = 'len'
len.__doc__ = `len(object)

Return the number of items of a sequence or collection.`
len.$pyargs = {
    args: ['object']
}
