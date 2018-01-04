import { BataviaError, TypeError } from '../core/exceptions'

import * as types from '../types'

export default function isinstance(args, kwargs) {
    if (arguments.length !== 2) {
        throw new BataviaError('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new TypeError('isinstance() takes no keyword arguments')
    }

    if (!args || args.length !== 2) {
        throw new TypeError('isinstance expected 2 arguments, got ' + args.length)
    }

    return new types.Bool(types.isinstance(args[0], args[1]))
}

isinstance.__doc__ = "isinstance(object, class-or-type-or-tuple) -> bool\n\nReturn whether an object is an instance of a class or of a subclass thereof.\nWith a type as second argument, return whether that is the object's type.\nThe form using a tuple, isinstance(x, (A, B, ...)), is a shortcut for\nisinstance(x, A) or isinstance(x, B) or ... (etc.)."
isinstance.$pyargs = true
