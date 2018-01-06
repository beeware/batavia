import { call_method } from '../core/callables'
import { BataviaError, PyTypeError } from '../core/exceptions'
import { type_name } from '../core/types'

import * as types from '../types'

export default function ord(args, kwargs) {
    if (arguments.length !== 2) {
        throw new BataviaError('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new PyTypeError("ord() doesn't accept keyword arguments")
    }
    if (!args || args.length !== 1) {
        throw new PyTypeError('ord() takes exactly one argument (' + args.length + ' given)')
    }
    var value = args[0]
    if (types.isinstance(value, [types.PyStr, types.PyBytes, types.PyBytearray])) {
        var charLength = call_method(value, '__len__')
        if (call_method(charLength, '__eq__', [new types.PyInt(1)])) {
            if (types.isinstance(value, types.PyStr)) {
                return new types.PyInt(value.charCodeAt(0))
            } else {
                return call_method(value, '__getitem__', [new types.PyInt(0)])
            }
        } else {
            throw new PyTypeError('ord() expected a character, but string of length ' + charLength + ' found')
        }
    } else {
        throw new PyTypeError('ord() expected string of length 1, but ' + type_name(value) + ' found')
    }
}

ord.__doc__ = 'ord(c) -> integer\n\nReturn the integer ordinal of a one-character string.'
ord.$pyargs = true
