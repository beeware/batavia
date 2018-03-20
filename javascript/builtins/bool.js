import { pyTypeError } from '../core/exceptions'
import { type_name } from '../core/types'

import { getattr } from '../builtins'
import * as types from '../types'

export default function bool(x) {
    if (x === undefined) {
        return types.pybool()
    } else if (x.__class__) {
        let output
        if (getattr(x, '__bool__', null)) {
            output = x.__bool__()
            if (types.isinstance(output, types.pybool)) {
                return output
            } else {
                throw pyTypeError(`__bool__ should return bool, returned ${type_name(output)}`)
            }
        } else {
            // Python bool() checks for __bool__ and then, if __bool__ is not defined,
            // for __len__. See https://docs.python.org/3.4/library/stdtypes.html#truth.
            if (getattr(x, '__len__', null)) {
                output = x.__len__()

                if (types.isinstance(output, types.pyint)) {
                    // Yes, the value under the hood can have been cast to string
                    // even if the output type is int and the value __len__ appears to
                    // output in the browser is an integer.
                    return !!parseInt(output.valueOf())
                } else {
                    throw pyTypeError(`'${type_name(output)}' object cannot be interpreted as an integer`)
                }
            } else {
                return true
            }
        }
    } else {
        return types.pybool((!!x.valueOf()))
    }
}

bool.__name__ = 'bool'
bool.__doc__ = `bool(x) -> bool

Returns True when the argument x is true, False otherwise.
In CPython, the builtins True and False are the only two instances of the class bool.
Also in CPython, the class bool is a subclass of the class int, and cannot be subclassed.
Batavia implements booleans as a native Javascript Boolean, enhanced with additional __dunder__ methods.
"Integer-ness" of booleans is faked via builtins.Bool's __int__ method.`
bool.$pyargs = {
    default_args: ['x']
}
