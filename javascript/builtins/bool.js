import { call_method } from '../core/callables'
import { TypeError } from '../core/exceptions'
import { type_name } from '../core/types'

import * as types from '../types'

export default function bool(x) {
    if (x === undefined) {
        return new types.PyBool()
    } else if (x.__bool__) {
        // x.__bool__, if it exists, is a batavia.types.PyFunction.js,
        // *not* a native Javascript function. Therefore we can't call it in
        // the seemingly obvious way, with __bool__().
        var output = call_method(x, '__bool__', [])
        if (types.isinstance(output, types.PyBool)) {
            return output
        } else {
            throw new TypeError('__bool__ should return bool, returned ' + type_name(output))
        }
    // Python bool() checks for __bool__ and then, if __bool__ is not defined,
    // for __len__. See https://docs.python.org/3.4/library/stdtypes.html#truth.
    } else if (x.__len__) {
        output = call_method(x, '__len__', [])
        var output_type = type_name(output)

        if (types.isinstance(output, types.PyInt)) {
            // Yes, the value under the hood can have been cast to string
            // even if the output type is int and the value __len__ appears to
            // output in the browser is an integer.
            return !!parseInt(output.valueOf())
        } else {
            throw new TypeError("'" + output_type + "' object cannot be interpreted as an integer")
        }
    } else {
        return new types.PyBool((!!x.valueOf()))
    }
}

bool.__doc__ = `bool(x) -> bool

Returns True when the argument x is true, False otherwise.
In CPython, the builtins True and False are the only two instances of the class bool.
Also in CPython, the class bool is a subclass of the class int, and cannot be subclassed.
Batavia implements booleans as a native Javascript Boolean, enhanced with additional __dunder__ methods.
"Integer-ness" of booleans is faked via builtins.Bool's __int__ method.`
bool.$pyargs = {
    default_args: ['x']
}
