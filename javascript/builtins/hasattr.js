import { AttributeError, TypeError } from '../core/exceptions'
import * as native from '../core/native'

import * as types from '../types'

export default function hasattr(args, kwargs) {
    if (args) {
        if (args.length === 2) {
            if (!types.isinstance(args[1], types.PyStr)) {
                throw new TypeError('hasattr(): attribute name must be string')
            }

            var val
            try {
                if (args[0].__getattribute__ === undefined) {
                    val = native.getattr(args[0], args[1])
                } else {
                    val = native.getattr_py(args[0], args[1])
                }
            } catch (err) {
                if (err instanceof AttributeError) {
                    val = undefined
                } else {
                    throw err
                }
            }

            return val !== undefined
        } else {
            throw new TypeError('hasattr expected exactly 2 arguments, got ' + args.length)
        }
    } else {
        throw new TypeError('hasattr expected exactly 2 arguments, got 0')
    }
}

hasattr.__doc__ = 'hasattr(object, name) -> bool\n\nReturn whether the object has an attribute with the given name.\n(This is done by calling getattr(object, name) and catching AttributeError.)'
hasattr.$pyargs = true
