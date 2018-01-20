import { call_method } from '../core/callables'
import { AttributeError } from '../core/exceptions'

import { sys } from '../modules'

export default function print(value, sep = ' ', end = '\n', file = sys.stdout, flush = true) {
    let elm
    let content

    if (value.length === 0) {
        call_method(file, 'write', [end], null)
    } else {
        for (var i = 0; i < value.length; i++) {
            elm = value[i]

            // output the content
            if (elm === null || elm === undefined) {
                content = 'None'
            } else {
                try {
                    content = call_method(elm, '__str__')
                } catch (e) {
                    if (e instanceof AttributeError) {
                        content = elm.toString()
                    } else {
                        throw e
                    }
                }
            }
            call_method(file, 'write', [content])

            // output the separator (or end marker if at the end of line)
            if (i === value.length - 1) {
                call_method(file, 'write', [end])
            } else {
                call_method(file, 'write', [sep])
            }
        }
    }

    if (flush) {
        call_method(file, 'flush', [])
    }
}

print.__doc__ = "print(value, ..., sep=' ', end='\\n', file=sys.stdout, flush=False)\n\nPrints the values to a stream, or to sys.stdout by default.\nOptional keyword arguments:\nfile:  a file-like object (stream); defaults to the current sys.stdout.\nsep:   string inserted between values, default a space.\nend:   string appended after the last value, default a newline.\nflush: whether to forcibly flush the stream."
print.$pyargs = {
    varargs: 'value',
    kwonlyargs: ['sep', 'end', 'file', 'flush']
}
