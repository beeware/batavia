import { call_function, call_method, pyargs } from '../../core/callables'
import { Exception, ValueError } from '../../core/exceptions'
import { create_pyclass, PyNone, PyObject } from '../../core/types'
import * as version from '../../core/version'

import * as types from '../../types'

export class JSONDecodeError extends PyObject {}
create_pyclass(JSONDecodeError, 'JSONDecodeError', [Exception])

class PyJSONDecoder extends PyObject {
    @pyargs({
        kwonlyargs: ['object_hook', 'parse_float', 'parse_int', 'parse_constant', 'strict', 'object_pairs_hook']
    })
    __init__(object_hook=PyNone, parse_float=PyNone, parse_int=PyNone, parse_constant=PyNone, strict=true, object_pairs_hook=PyNone) {
        this.object_hook = object_hook
        this.parse_float = parse_float
        this.parse_int = parse_int
        this.parse_constant = parse_constant
        this.strict = strict
        this.object_pairs_hook = object_pairs_hook
    }

    @pyargs({
        args: ['s']
    })
    decode(s) {
        var reviver = (k, v) => types.js2py(v)
        if (this.object_hook !== PyNone) {
            let hook = this.object_hook
            reviver = function(k, v) {
                var o = types.js2py(v)
                if (types.isinstance(o, types.PyDict)) {
                    o = call_function(hook.$vm, hook, [o])
                }
                return o
            }
        }

        let ret
        try {
            ret = JSON.parse(s, reviver)
        } catch (e) {
            if (version.earlier('3.5a0')) {
                throw new ValueError(e.message)
            } else {
                throw new JSONDecodeError(e.message)
            }
        }
        return ret
    }
}

PyJSONDecoder.prototype.__doc__ = `Simple JSON <http://json.org> decoder

Performs the following translations in decoding by default:

+---------------+-------------------+
| JSON          | Python            |
+===============+===================+
| object        | dict              |
+---------------+-------------------+
| array         | list              |
+---------------+-------------------+
| string        | str               |
+---------------+-------------------+
| number (int)  | int               |
+---------------+-------------------+
| number (real) | float             |
+---------------+-------------------+
| true          | True              |
+---------------+-------------------+
| false         | False             |
+---------------+-------------------+
| null          | None              |
+---------------+-------------------+

It also understands \`\`NaN\`\`, \`\`Infinity\`\`, and \`\`-Infinity\`\` as
their corresponding \`\`float\`\` values, which is outside the JSON spec.
`
create_pyclass(PyJSONDecoder, 'JSONDecoder')

export var JSONDecoder = PyJSONDecoder.__class__

export function loads(s, encoding=PyNone, cls=JSONDecoder, object_hook=PyNone, parse_float=PyNone, parse_int=PyNone, parse_constant=PyNone, object_pairs_hook=PyNone, kw) {
    let dec = call_function(this, cls, [], {
        'object_hook': object_hook,
        'parse_float': parse_float,
        'parse_int': parse_int,
        'parse_constant': parse_constant,
        'strict': true,
        'object_pairs_hook': object_pairs_hook
    })
    return call_method(dec, 'decode', [s])
}
loads.__doc__ = `Deserialize \`\`s\`\` (a \`\`str\`\`, \`\`bytes\`\` or \`\`bytearray\`\` instance
containing a JSON document) to a Python object.

\`\`object_hook\`\` is an optional function that will be called with the
result of any object literal decode (a \`\`dict\`\`). The return value of
\`\`object_hook\`\` will be used instead of the \`\`dict\`\`. This feature
can be used to implement custom decoders (e.g. JSON-RPC class hinting).

\`\`object_pairs_hook\`\` is an optional function that will be called with the
result of any object literal decoded with an ordered list of pairs.  The
return value of \`\`object_pairs_hook\`\` will be used instead of the \`\`dict\`\`.
This feature can be used to implement custom decoders that rely on the
order that the key and value pairs are decoded (for example,
collections.OrderedDict will remember the order of insertion). If
\`\`object_hook\`\` is also defined, the \`\`object_pairs_hook\`\` takes priority.

\`\`parse_float\`\`, if specified, will be called with the string
of every JSON float to be decoded. By default this is equivalent to
float(num_str). This can be used to use another datatype or parser
for JSON floats (e.g. decimal.Decimal).

\`\`parse_int\`\`, if specified, will be called with the string
of every JSON int to be decoded. By default this is equivalent to
int(num_str). This can be used to use another datatype or parser
for JSON integers (e.g. float).

\`\`parse_constant\`\`, if specified, will be called with one of the
following strings: -Infinity, Infinity, NaN.
This can be used to raise an exception if invalid JSON numbers
are encountered.

To use a custom \`\`JSONDecoder\`\` subclass, specify it with the \`\`cls\`\`
kwarg; otherwise \`\`JSONDecoder\`\` is used.

The \`\`encoding\`\` argument is ignored and deprecated.
`
loads.$pyargs = {
    args: ['s'],
    kwonlyargs: ['encoding', 'cls', 'object_hook', 'parse_float', 'parse_int', 'parse_constant', 'object_pairs_hook'],
    kwargs: 'kw'
}


export function load(fp, cls, object_hook, parse_float, parse_int, parse_constant, object_pairs_hook, kw) {
    let s = call_method(fp, 'read')
    return loads(s, PyNone, cls, object_hook, parse_float, parse_int, parse_constant, object_pairs_hook)
}

load.__doc__ = `Deserialize \`\`fp\`\` (a \`\`.read()\`\`-supporting file-like object containing
a JSON document) to a Python object.

\`\`object_hook\`\` is an optional function that will be called with the
result of any object literal decode (a \`\`dict\`\`). The return value of
\`\`object_hook\`\` will be used instead of the \`\`dict\`\`. This feature
can be used to implement custom decoders (e.g. JSON-RPC class hinting).

\`\`object_pairs_hook\`\` is an optional function that will be called with the
result of any object literal decoded with an ordered list of pairs.  The
return value of \`\`object_pairs_hook\`\` will be used instead of the \`\`dict\`\`.
This feature can be used to implement custom decoders that rely on the
order that the key and value pairs are decoded (for example,
collections.OrderedDict will remember the order of insertion). If
\`\`object_hook\`\` is also defined, the \`\`object_pairs_hook\`\` takes priority.

To use a custom \`\`JSONDecoder\`\` subclass, specify it with the \`\`cls\`\`
kwarg; otherwise \`\`JSONDecoder\`\` is used.`
load.$pyargs = {
    args: ['s'],
    kwonlyargs: ['cls', 'object_hook', 'parse_float', 'parse_int', 'parse_constant', 'object_pairs_hook'],
    kwargs: 'kw'
}
