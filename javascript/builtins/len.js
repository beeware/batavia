import { call_method } from '../core/callables'
import { type_name } from '../core/types'
import { TypeError } from '../core/exceptions'

export default function len(object) {
    if (object.__len__) {
        return call_method(object, '__len__', [])
    }

    throw new TypeError("object of type '" + type_name(object) + "' has no len()")
}

len.__doc__ = 'len(object)\n\nReturn the number of items of a sequence or collection.'
len.$pyargs = {
    args: ['object']
}
