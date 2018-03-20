import { pyAttributeError } from '../core/exceptions'

import { sys } from '../modules'
import * as types from '../types'

export default function print(value, sep = ' ', end = '\n', file = sys.stdout, flush = false) {
    let elm
    let content

    if (value.length === 0) {
        file.write(end)
    } else {
        for (var i = 0; i < value.length; i++) {
            elm = value[i]

            // output the content
            if (elm === null || elm === undefined) {
                content = 'None'
            } else {
                try {
                    content = elm.__str__()
                } catch (e) {
                    if (types.isinstance(e, pyAttributeError)) {
                        content = elm.toString()
                    } else {
                        throw e
                    }
                }
            }
            file.write(content)

            // output the separator (or end marker if at the end of line)
            if (i === value.length - 1) {
                file.write(end)
            } else {
                file.write(sep)
            }
        }
    }

    if (flush) {
        file.flush()
    }
}

print.__name__ = 'print'
print.__doc__ = `print(value, ..., sep=' ', end='\\n', file=sys.stdout, flush=False)

Prints the values to a stream, or to sys.stdout by default.
Optional keyword arguments:
file:  a file-like object (stream); defaults to the current sys.stdout.
sep:   string inserted between values, default a space.
end:   string appended after the last value, default a newline.
flush: whether to forcibly flush the stream.`
print.$pyargs = {
    varargs: 'value',
    kwonlyargs: ['sep', 'end', 'file', 'flush']
}
