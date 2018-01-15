import { AttributeError, TypeError } from '../core/exceptions'
import * as native from '../core/native'

import * as types from '../types'

export default function getattr(args, kwargs) {
    if (args) {
        if (args.length === 2 || args.length === 3) {
            if (!types.isinstance(args[1], types.PyStr)) {
                throw new TypeError('getattr(): attribute name must be string')
            }

            try {
                if (args[0].__getattribute__ === undefined) {
                    return native.getattr(args[0], args[1])
                } else {
                    return native.getattr_py(args[0], args[1])
                }
            } catch (e) {
                if (e instanceof AttributeError && args.length === 3) {
                    return args[2]
                } else {
                    throw e
                }
            }
        } else if (args.length < 2) {
            throw new TypeError('getattr expected at least 2 arguments, got ' + args.length)
        } else {
            throw new TypeError('getattr expected at most 3 arguments, got ' + args.length)
        }
    } else {
        throw new TypeError('getattr expected at least 2 arguments, got 0')
    }
}

