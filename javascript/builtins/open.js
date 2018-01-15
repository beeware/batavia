import { NotImplementedError } from '../core/exceptions'

export default function open(args, kwargs) {
    throw new NotImplementedError("Builtin Batavia function 'open' not implemented")
}

open.__doc__ = 'open() is complicated.' // 6575 character long docstring
open.$pyargs = true
