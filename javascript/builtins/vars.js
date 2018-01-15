import { NotImplementedError } from '../core/exceptions'

export default function vars(object) {
    throw new NotImplementedError("Builtin Batavia function 'vars' not implemented")
}

vars.__doc__ = 'vars([object]) -> dictionary\n\nWithout arguments, equivalent to locals().\nWith an argument, equivalent to object.__dict__.'
vars.$pyargs = {
    default_args: ['object']
}
