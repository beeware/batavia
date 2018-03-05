import { PyNotImplementedError } from '../core/exceptions'

export default function eval_(source, globals, locals) {
    throw new PyNotImplementedError("Builtin Batavia function 'eval' not implemented")
}

eval_.__name__ = 'eval'
eval_.__doc__ = `eval(source[, globals[, locals]]) -> value

Evaluate the source in the context of globals and locals.
The source may be a string representing a Python expression
or a code object as returned by compile().
The globals must be a dictionary and locals can be any mapping,
defaulting to the current globals and locals.
If only globals is given, locals defaults to it.`
eval_.$pyargs = {
    args: ['source'],
    default_args: ['globals', 'locals']
}
