import { BataviaError, PyTypeError } from '../core/exceptions'

import * as types from '../types'

export default function callable(args, kwargs) {
    if (arguments.length !== 2) {
        throw new BataviaError('Batavia calling convention not used.')
    }
    if (kwargs && Object.keys(kwargs).length > 0) {
        throw new PyTypeError("callable() doesn't accept keyword arguments")
    }
    if (!args || args.length !== 1) {
        throw new PyTypeError('callable() takes exactly one argument (' + args.length + ' given)')
    }
    if ((args[0] instanceof Function) || (args[0] instanceof types.PyFunction) || (args[0] instanceof types.PyType)) {
        return new types.PyBool(true)
    } else {
        return new types.PyBool(false)
    }
}

callable.__doc__ = 'callable(object) -> bool\n\nReturn whether the object is callable (i.e., some kind of function).\nNote that classes are callable, as are instances of classes with a\n__call__() method.'
callable.$pyargs = true
