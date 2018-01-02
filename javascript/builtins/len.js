import { call_method } from '../core/callables'
import { type_name } from '../core/types/types'
import { TypeError } from '../core/exceptions'

export default function len(args, kwargs) {
    if (!args || args.length !== 1 || args[0] === undefined) {
        throw new TypeError.$pyclass('len() takes exactly one argument (' + args.length + ' given)')
    }

    var value = args[0]

    if (value.__len__) {
        return call_method(value, '__len__', [])
    }

    throw new TypeError.$pyclass("object of type '" + type_name(value) + "' has no len()")
}

len.__doc__ = 'len(object)\n\nReturn the number of items of a sequence or collection.'
len.$pyargs = true
