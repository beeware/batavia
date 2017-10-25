var PyObject = require('../../core').Object
var create_pyclass = require('../../core').create_pyclass
var callables = require('../../core').callables
var exceptions = require('../../core').exceptions
var version = require('../../core').version
var type_name = require('../../core').type_name
var types = require('../../types')
var builtins = require('../../builtins')
var validateParams = require('./utils').validateParams

function JSONEncoder() {
    PyObject.call(this)
}

create_pyclass(JSONEncoder, 'JSONEncoder')

const encoder_defaults = {
    'skipkeys': false,
    'ensure_ascii': true,
    'check_circular': true,
    'allow_nan': true,
    'sort_keys': false,
    'indent': 0,
    'separators': [', ', ': '],
    'default': null
}

function _JSONEncoder(args = [], kwargs = {}) {
    var keywords = [
        'skipkeys',
        'ensure_ascii',
        'check_circular',
        'allow_nan',
        'sort_keys',
        'indent',
        'separators',
        'default'
    ]
    var enc = validateParams({
        args: args,
        kwargs: kwargs,
        names: keywords,
        defaults: encoder_defaults,
        funcName: 'JSONEncoder'
    })

    var len = enc.separators.length
    if (len !== 2) {
        throw new exceptions.ValueError.$pyclass(
            'JSONEncoder separators length must be 2 (got ' + len + ' instead)'
        )
    }

    var ret = new JSONEncoder()
    Object.assign(ret, enc)
    ret.item_separator = ret.separators[0]
    ret.key_separator = ret.separators[1]
    delete ret.separators

    if (keywords.indexOf('separators') &&
            !kwargs.hasOwnProperty('separators')) {
        if (!keywords.indexOf('indent') || kwargs.hasOwnProperty('indent')) {
            ret.item_separator = ','
        }
    }

    return ret
}

_JSONEncoder.$pyargs = true

JSONEncoder.prototype.encode = function(obj) {
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

var make_encode = function(
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
    } else if (types.isinstance(indent, types.Str)) {
        indentstr = function(lvl) { return '\n' + indent.repeat(lvl) }
    } else {
        indentstr = function(lvl) { return '\n' + ' '.repeat(lvl * indent) }
    }

    var encodeList = function(obj, indent_level) {
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

    var encodeDict = function(obj, indent_level) {
        var current_indent = indentstr(indent_level)
        var str_contents = []
        var items = callables.call_method(obj, 'keys')
        if (sort_keys) {
            items = callables.call_function(builtins.sorted, [items])
        }
        for (let kv of items) {
            var key = encodeKey(kv, ensure_ascii, allow_nan)
            if (key !== null) {
                str_contents.push(
                    key + key_separator + encode(obj.get(kv), indent_level + 1)
                )
            } else if (!skipkeys) {
                throw new exceptions.TypeError.$pyclass(
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

    var encode = function(obj, indent_level) {
        var ret = encodeBasicType(obj, ensure_ascii, allow_nan)

        if (ret === null) {
            if (seen !== undefined) {
                if (seen.has(obj)) {
                    throw new exceptions.ValueError.$pyclass(
                        'Circular reference detected'
                    )
                }
                seen.add(obj)
            }

            if (types.isinstance(obj, [types.List, types.Tuple])) {
                ret = encodeList(obj, indent_level)
            } else if (types.isinstance(obj, types.Dict)) {
                ret = encodeDict(obj, indent_level)
            } else if (default_) {
                ret = encode(callables.call_function(default_, [obj]), indent_level)
            } else {
                if (version.earlier('3.6')) {
                    throw new exceptions.TypeError.$pyclass(
                        obj.toString() + ' is not JSON serializable'
                    )
                } else {
                    throw new exceptions.TypeError.$pyclass(
                        "Object of type '" + type_name(obj) + "' is not JSON serializable"
                    )
                }
            }

            if (seen !== undefined) {
                seen.delete(obj)
            }
        }

        return new types.Str(ret)
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

var encode_ascii = function(s) {
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

var encodeBasicType = function(o, ensure_ascii, allow_nan) {
    if (types.isinstance(o, types.Str)) {
        var ret = JSON.stringify(o)
        if (ensure_ascii) {
            ret = encode_ascii(ret)
        }
        return ret
    }

    if (types.isinstance(o, [types.Int, types.Float])) {
        var text = o.toString()
        if (transFloat.hasOwnProperty(text)) {
            if (allow_nan) {
                text = transFloat[text]
            } else {
                throw new exceptions.ValueError.$pyclass(
                    'Out of range float values are not JSON compliant'
                )
            }
        }

        return text
    }

    if (types.isinstance(o, types.NoneType)) {
        return 'null'
    }

    if (types.isinstance(o, types.Bool)) {
        if (o) {
            return 'true'
        } else {
            return 'false'
        }
    }

    return null
}

var encodeKey = function(o, ensure_ascii, allow_nan) {
    var ret = encodeBasicType(o, ensure_ascii, allow_nan)
    if (ret !== null && !types.isinstance(o, types.Str)) {
        ret = '"' + ret + '"'
    }

    return ret
}

JSONEncoder.prototype.iterencode = function(obj) {
    if (arguments.length !== 1) {
        throw new exceptions.TypeError.$pyclass(
            'iterencode() expected 1 positional argument (got ' +
            arguments.length + ')'
        )
    }

    // TODO should return generator
    return new types.List([this.encode(obj)])
}

var dumps = function(args, kwargs) {
    var keywords = [
        'obj',
        'skipkeys',
        'ensure_ascii',
        'check_circular',
        'allow_nan',
        'cls',
        'indent',
        'separators',
        'default',
        'sort_keys'
    ]
    var enc = validateParams({
        args: args,
        kwargs: kwargs,
        names: keywords,
        defaults: Object.assign({'cls': null}, encoder_defaults),
        numRequired: 1,
        funcName: 'dumps'
    })

    var obj = enc['obj']
    delete enc['obj']

    var cls = enc['cls']
    delete enc['cls']

    if (cls === null || types.isinstance(cls, types.NoneType)) {
        cls = _JSONEncoder
    }

    return callables.call_method(
        callables.call_function(cls, [], enc),
        'encode',
        [obj]
    )
}

dumps.$pyargs = true

var dump = function(args, kwargs) {
    var keywords = [
        'obj',
        'fp',
        'skipkeys',
        'ensure_ascii',
        'check_circular',
        'allow_nan',
        'cls',
        'indent',
        'separators',
        'default',
        'sort_keys'
    ]
    var enc = validateParams({
        args: args,
        kwargs: kwargs,
        names: keywords,
        defaults: Object.assign({'cls': null}, encoder_defaults),
        numRequired: 2,
        funcName: 'dump'
    })

    var fp = enc['fp']
    delete enc['fp']

    var str = dumps([], enc)
    callables.call_method(fp, 'write', [str])
}

dump.$pyargs = true

module.exports = {
    'JSONEncoder': _JSONEncoder,
    'dumps': dumps,
    'dump': dump
}

