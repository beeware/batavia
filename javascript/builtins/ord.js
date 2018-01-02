import { call_method } from '../core/callables'
import { BataviaError, TypeError } from '../core/exceptions'
import { type_name } from '../core/types/types'

import * as types from '../types'

export default function ord(args, kwargs) {
    if (arguments.length !== 2) {
        throw new BataviaError.$pyclass('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new TypeError.$pyclass("ord() doesn't accept keyword arguments")
    }
    if (!args || args.length !== 1) {
        throw new TypeError.$pyclass('ord() takes exactly one argument (' + args.length + ' given)')
    }
    var value = args[0]
    if (types.isinstance(value, [types.Str, types.Bytes, types.Bytearray])) {
        var charLength = call_method(value, '__len__')
        if (call_method(charLength, '__eq__', [new types.Int(1)])) {
            if (types.isinstance(value, types.Str)) {
                return new types.Int(value.charCodeAt(0))
            } else {
                return call_method(value, '__getitem__', [new types.Int(0)])
            }
        } else {
            throw new TypeError.$pyclass('ord() expected a character, but string of length ' + charLength + ' found')
        }
    } else {
        throw new TypeError.$pyclass('ord() expected string of length 1, but ' + type_name(value) + ' found')
    }
}

ord.__doc__ = 'ord(c) -> integer\n\nReturn the integer ordinal of a one-character string.'
ord.$pyargs = true
