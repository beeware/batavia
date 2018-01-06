import { PyNotImplementedError } from '../core/exceptions'

export default function vars(args, kwargs) {
    throw new PyNotImplementedError("Builtin Batavia function 'vars' not implemented")
}

vars.__doc__ = 'vars([object]) -> dictionary\n\nWithout arguments, equivalent to locals().\nWith an argument, equivalent to object.__dict__.'
vars.$pyargs = true
