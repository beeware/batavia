import { call_function, call_method, pyargs } from '../../core/callables'
import { PyTypeError, PyValueError } from '../../core/exceptions'
import { create_pyclass, type_name, PyNone, PyObject } from '../../core/types'
import * as version from '../../core/version'

import * as types from '../../types'
import * as builtins from '../../builtins'

class PyJSONEncoder extends PyObject {
    @pyargs({
        kwonlyargs: ['skipkeys', 'ensure_ascii', 'check_circular', 'allow_nan', 'sort_keys', 'indent', 'separators', 'default']
    })
    __init__(skipkeys = false, ensure_ascii = true, check_circular = true, allow_nan =  true,
             sort_keys = false, indent = 0, separators, default_ = PyNone) {
        this.skipkeys = skipkeys
        this.ensure_ascii = ensure_ascii
        this.check_circular = check_circular
        this.allow_nan = allow_nan
        this.sort_keys = sort_keys
        this.indent = indent
        if (separators === undefined) {
            this.item_separator = ', '
            this.key_separator = ': '
        } else {
            this.item_separator = separators.__getitem__(new types.PyInt(0))
            this.key_separator = separators.__getitem__(new types.PyInt(1))
        }
        this.default = default_
    }

    @pyargs({
        args: ['obj']
    })
    encode(obj) {
        // TODO use iterencode once it is implemented as an actual generator
        var seen
        if (this.check_circular) {
            seen = new Set()
        }
        return make_encode(
            this.skipkeys,
            this.ensure_ascii,
            this.allow_nan,
            this.sort_keys,
            this.indent,
            this.item_separator,
            this.key_separator,
            this.default,
            seen
        )(obj, 1)
    }

    @pyargs({
        args: ['obj']
    })
    iterencode(obj) {
        // TODO should return generator
        return new types.PyList([this.encode(obj)])
    }
}

PyJSONEncoder.__doc__ = `Extensible JSON <http://json.org> encoder for Python data structures.

    Supports the following objects and types by default:

    +-------------------+---------------+
    | Python            | JSON          |
    +===================+===============+
    | dict              | object        |
    +-------------------+---------------+
    | list, tuple       | array         |
    +-------------------+---------------+
    | str               | string        |
    +-------------------+---------------+
    | int, float        | number        |
    +-------------------+---------------+
    | True              | true          |
    +-------------------+---------------+
    | False             | false         |
    +-------------------+---------------+
    | None              | null          |
    +-------------------+---------------+

    To extend this to recognize other objects, subclass and implement a
    \`\`.default()\`\` method with another method that returns a serializable
    object for \`\`o\`\` if possible, otherwise it should call the superclass
    implementation (to raise \`\`PyTypeError\`\`).`
create_pyclass(PyJSONEncoder, 'JSONEncoder')

export var JSONEncoder = PyJSONEncoder.__class__


function make_encode(
    skipkeys,
    ensure_ascii,
    allow_nan,
    sort_keys,
    indent,
    item_separator,
    key_separator,
    default_,
    seen
) {
    var indentstr
    if (!indent) {
        indentstr = function() { return '' }
    } else if (types.isinstance(indent, types.PyStr)) {
        indentstr = function(lvl) { return '\n' + indent.repeat(lvl) }
    } else {
        indentstr = function(lvl) { return '\n' + ' '.repeat(lvl * indent) }
    }

    function encodeList(obj, indent_level) {
        var current_indent = indentstr(indent_level)
        var str_contents = []
        for (let elem of obj) {
            str_contents.push(encode(elem, indent_level + 1))
        }

        if (str_contents.length === 0) {
            return '[]'
        } else {
            return [
                '[' + current_indent,
                str_contents.join(item_separator + current_indent),
                indentstr(indent_level - 1) + ']'
            ].join('')
        }
    }

    function encodeDict(obj, indent_level) {
        var current_indent = indentstr(indent_level)
        var str_contents = []
        var items = call_method(obj, 'keys')
        if (sort_keys) {
            items = call_function(this, builtins.sorted, [items])
        }
        for (let kv of items) {
            var key = encodeKey(kv, ensure_ascii, allow_nan)
            if (key !== null) {
                str_contents.push(
                    key + key_separator + encode(obj.get(kv), indent_level + 1)
                )
            } else if (!skipkeys) {
                throw new PyTypeError(
                    'keys must be a string'
                )
            }
        }

        if (str_contents.length === 0) {
            return '{}'
        } else {
            return [
                '{' + current_indent,
                str_contents.join(item_separator + current_indent),
                indentstr(indent_level - 1) + '}'
            ].join('')
        }
    }

    function encode(obj, indent_level) {
        var ret = encodeBasicType(obj, ensure_ascii, allow_nan)

        if (ret === null) {
            if (seen !== undefined) {
                if (seen.has(obj)) {
                    throw new PyValueError(
                        'Circular reference detected'
                    )
                }
                seen.add(obj)
            }

            if (types.isinstance(obj, [types.PyList, types.PyTuple])) {
                ret = encodeList(obj, indent_level)
            } else if (types.isinstance(obj, types.PyDict)) {
                ret = encodeDict(obj, indent_level)
            } else if (default_ !== PyNone) {
                ret = encode(call_function(this, default_, [obj]), indent_level)
            } else {
                if (version.earlier('3.6')) {
                    throw new PyTypeError(
                        obj.toString() + ' is not JSON serializable'
                    )
                } else {
                    throw new PyTypeError(
                        "Object of type '" + type_name(obj) + "' is not JSON serializable"
                    )
                }
            }

            if (seen !== undefined) {
                seen.delete(obj)
            }
        }

        return new types.PyStr(ret)
    }

    return encode
}

const transFloat = {
    'nan': 'NaN',
    'inf': 'Infinity',
    '-inf': '-Infinity'
}

var toHexPad = function(n, width) {
    var ret = '0'.repeat(width) + n.toString(16)
    return ret.slice(-width)
}

function encode_ascii(s) {
    function replacer(match, p) {
        var n = p.charCodeAt(0)
        if (n < 0x10000) {
            return '\\u' + toHexPad(n, 4)
        } else {
            n -= 0x10000
            // XXX should be safe since max Unicode is 21-bit wide
            var s1 = 0xd800 | ((n >> 10) & 0x3ff)
            var s2 = 0xdc00 | (n & 0x3ff)
            return '\\u' + toHexPad(s1, 4) + '\\u' + toHexPad(s2, 4)
        }
    }

    return s.replace(/([^\x00-~])/g, replacer) // eslint-disable-line no-control-regex
}

function encodeBasicType(o, ensure_ascii, allow_nan) {
    if (types.isinstance(o, types.PyStr)) {
        var ret = JSON.stringify(o)
        if (ensure_ascii) {
            ret = encode_ascii(ret)
        }
        return ret
    }

    if (types.isinstance(o, [types.PyInt, types.PyFloat])) {
        var text = o.toString()
        if (transFloat.hasOwnProperty(text)) {
            if (allow_nan) {
                text = transFloat[text]
            } else {
                throw new PyValueError(
                    'Out of range float values are not JSON compliant'
                )
            }
        }

        return text
    }

    if (types.isinstance(o, types.PyNoneType)) {
        return 'null'
    }

    if (types.isinstance(o, types.PyBool)) {
        if (o) {
            return 'true'
        } else {
            return 'false'
        }
    }

    return null
}

function encodeKey(o, ensure_ascii, allow_nan) {
    var ret = encodeBasicType(o, ensure_ascii, allow_nan)
    if (ret !== null && !types.isinstance(o, types.PyStr)) {
        ret = '"' + ret + '"'
    }

    return ret
}


export function dumps(obj, skipkeys = false, ensure_ascii = true, check_circular = true, allow_nan =  true,
                      cls = JSONEncoder, indent = 0, separators, default_ = PyNone, sort_keys = false, kw) {
    let enc = call_function(this, cls, [], {
        'skipkeys': skipkeys,
        'ensure_ascii': ensure_ascii,
        'check_circular': check_circular,
        'allow_nan': allow_nan,
        'indent': indent,
        'separators': separators,
        'sort_keys': sort_keys,
        'default': default_
    })
    return call_method(enc, 'encode', [obj])
}
dumps.__doc__ = `Serialize \`\`obj\`\` to a JSON formatted \`\`str\`\`.

    If \`\`skipkeys\`\` is true then \`\`dict\`\` keys that are not basic types
    (\`\`str\`\`, \`\`int\`\`, \`\`float\`\`, \`\`bool\`\`, \`\`None\`\`) will be skipped
    instead of raising a \`\`PyTypeError\`\`.

    If \`\`ensure_ascii\`\` is false, then the return value can contain non-ASCII
    characters if they appear in strings contained in \`\`obj\`\`. Otherwise, all
    such characters are escaped in JSON strings.

    If \`\`check_circular\`\` is false, then the circular reference check
    for container types will be skipped and a circular reference will
    result in an \`\`PyOverflowError\`\` (or worse).

    If \`\`allow_nan\`\` is false, then it will be a \`\`PyValueError\`\` to
    serialize out of range \`\`float\`\` values (\`\`nan\`\`, \`\`inf\`\`, \`\`-inf\`\`) in
    strict compliance of the JSON specification, instead of using the
    JavaScript equivalents (\`\`NaN\`\`, \`\`Infinity\`\`, \`\`-Infinity\`\`).

    If \`\`indent\`\` is a non-negative integer, then JSON array elements and
    object members will be pretty-printed with that indent level. An indent
    level of 0 will only insert newlines. \`\`None\`\` is the most compact
    representation.

    If specified, \`\`separators\`\` should be an \`\`(item_separator, key_separator)\`\`
    tuple.  The default is \`\`(', ', ': ')\`\` if *indent* is \`\`None\`\` and
    \`\`(',', ': ')\`\` otherwise.  To get the most compact JSON representation,
    you should specify \`\`(',', ':')\`\` to eliminate whitespace.

    \`\`default(obj)\`\` is a function that should return a serializable version
    of obj or raise PyTypeError. The default simply raises PyTypeError.

    If *sort_keys* is true (default: \`\`False\`\`), then the output of
    dictionaries will be sorted by key.

    To use a custom \`\`JSONEncoder\`\` subclass (e.g. one that overrides the
    \`\`.default()\`\` method to serialize additional types), specify it with
    the \`\`cls\`\` kwarg; otherwise \`\`JSONEncoder\`\` is used.`
dumps.$pyargs = {
    args: ['obj'],
    kwonlyargs: ['skipkeys', 'ensure_ascii', 'check_circular', 'allow_nan', 'cls', 'indent', 'separators', 'default', 'sort_keys'],
    kwargs: 'kw'
}

export function dump(obj, fp, skipkeys = false, ensure_ascii = true, check_circular = true, allow_nan =  true,
                      cls = JSONEncoder, indent = 0, separators, sort_keys = false, default_ = PyNone, kw) {
    let str = dumps(obj, skipkeys, ensure_ascii, check_circular, allow_nan, cls, indent, separators, default_, sort_keys, kw)
    call_method(fp, 'write', [str])
}
dumps.__doc__ = `Serialize \`\`obj\`\` as a JSON formatted stream to \`\`fp\`\` (a
\`\`.write()\`\`-supporting file-like object).

If \`\`skipkeys\`\` is true then \`\`dict\`\` keys that are not basic types
(\`\`str\`\`, \`\`int\`\`, \`\`float\`\`, \`\`bool\`\`, \`\`None\`\`) will be skipped
instead of raising a \`\`PyTypeError\`\`.

If \`\`ensure_ascii\`\` is false, then the strings written to \`\`fp\`\` can
contain non-ASCII characters if they appear in strings contained in
\`\`obj\`\`. Otherwise, all such characters are escaped in JSON strings.

If \`\`check_circular\`\` is false, then the circular reference check
for container types will be skipped and a circular reference will
result in an \`\`PyOverflowError\`\` (or worse).

If \`\`allow_nan\`\` is false, then it will be a \`\`PyValueError\`\` to
serialize out of range \`\`float\`\` values (\`\`nan\`\`, \`\`inf\`\`, \`\`-inf\`\`)
in strict compliance of the JSON specification, instead of using the
JavaScript equivalents (\`\`NaN\`\`, \`\`Infinity\`\`, \`\`-Infinity\`\`).

If \`\`indent\`\` is a non-negative integer, then JSON array elements and
object members will be pretty-printed with that indent level. An indent
level of 0 will only insert newlines. \`\`None\`\` is the most compact
representation.

If specified, \`\`separators\`\` should be an \`\`(item_separator, key_separator)\`\`
tuple.  The default is \`\`(', ', ': ')\`\` if *indent* is \`\`None\`\` and
\`\`(',', ': ')\`\` otherwise.  To get the most compact JSON representation,
you should specify \`\`(',', ':')\`\` to eliminate whitespace.

\`\`default(obj)\`\` is a function that should return a serializable version
of obj or raise PyTypeError. The default simply raises PyTypeError.

If *sort_keys* is true (default: \`\`False\`\`), then the output of
dictionaries will be sorted by key.

To use a custom \`\`JSONEncoder\`\` subclass (e.g. one that overrides the
\`\`.default()\`\` method to serialize additional types), specify it with
the \`\`cls\`\` kwarg; otherwise \`\`JSONEncoder\`\` is used.
`
dump.$pyargs = {
    args: ['obj', 'fp'],
    kwonlyargs: ['skipkeys', 'ensure_ascii', 'check_circular', 'allow_nan', 'cls', 'indent', 'separators', 'sort_keys', 'default'],
    kwargs: 'kw'
}
