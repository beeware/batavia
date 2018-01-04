import { NotImplementedError } from '../core/exceptions'

export default function exec(args, kwargs) {
    throw new NotImplementedError("Builtin Batavia function 'exec' not implemented")
}

exec.__doc__ = 'exec(object[, globals[, locals]])\n\nRead and execute code from an object, which can be a string or a code\nobject.\nThe globals and locals are dictionaries, defaulting to the current\nglobals and locals.  If only globals is given, locals defaults to it.'
exec.$pyargs = true
