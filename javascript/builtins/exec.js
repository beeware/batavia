import { NotImplementedError } from '../core/exceptions'

export default function exec(object, globals, locals) {
    throw new NotImplementedError("Builtin Batavia function 'exec' not implemented")
}

exec.__doc__ = `exec(object[, globals[, locals]])

Read and execute code from an object, which can be a string or a code
object.
The globals and locals are dictionaries, defaulting to the current
globals and locals.  If only globals is given, locals defaults to it.`
exec.$pyargs = {
    args: ['source'],
    default_args: ['globals', 'locals']
}
