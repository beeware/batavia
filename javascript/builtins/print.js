import { call_method } from '../core/callables'
import { PyAttributeError } from '../core/exceptions'

import { sys } from '../modules'

export default function print(args, kwargs) {
    var sep = kwargs['sep'] || ' '
    var end = kwargs['end'] || '\n'
    var file = kwargs['file'] || sys.stdout
    var elm
    var content

    if (args.length === 0) {
        call_method(file, 'write', [end], null)
    } else {
        for (var i = 0; i < args.length; i++) {
            elm = args[i]

            // output the content
            if (elm === null || elm === undefined) {
                content = 'None'
            } else {
                try {
                    content = call_method(elm, '__str__', [], null)
                } catch (e) {
                    if (e instanceof PyAttributeError) {
                        content = elm.toString()
                    } else {
                        throw e
                    }
                }
            }
            call_method(file, 'write', [content], null)

            // output the separator (or end marker if at the end of line)
            if (i === args.length - 1) {
                call_method(file, 'write', [end], null)
            } else {
                call_method(file, 'write', [sep], null)
            }
        }
    }

    if (kwargs['flush']) {
        call_method(file, 'flush', [], null)
    }
}

print.__doc__ = "print(value, ..., sep=' ', end='\\n', file=sys.stdout, flush=False)\n\nPrints the values to a stream, or to sys.stdout by default.\nOptional keyword arguments:\nfile:  a file-like object (stream); defaults to the current sys.stdout.\nsep:   string inserted between values, default a space.\nend:   string appended after the last value, default a newline.\nflush: whether to forcibly flush the stream."
print.$pyargs = true
