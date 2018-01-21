import { NotImplementedError } from '../core/exceptions'

export default function vars(object) {
    throw new NotImplementedError("Builtin Batavia function 'vars' not implemented")
}

vars.__name__ = 'vars'
vars.__doc__ = `vars([object]) -> dictionary

Without arguments, equivalent to locals().
With an argument, equivalent to object.__dict__.`
vars.$pyargs = {
    default_args: ['object']
}
