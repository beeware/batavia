var PyObject = require('../core').Object
var create_pyclass = require('../core').create_pyclass
var callables = require('../core').callables
var exceptions = require('../core').exceptions
var types = require('../types')
var builtins = require('../builtins')

var json = {
    __doc__: '',  // TODO
    __file__: 'batavia/modules/json.js',
    __name__: 'json',
    __package__: '',  // TODO
    'JSONEncoder': _JSONEncoder
}


function JSONEncoder() {
    PyObject.call(this)
}

create_pyclass(JSONEncoder, 'JSONEncoder')


function _JSONEncoder(args, kwargs) {
    var keywords = [
        'skipkeys',
        'ensure_ascii',
        'check_circular',
        'allow_nan',
        'sort_keys',
        'indent',
        'separators',
        'default',
    ]
    var enc = {
        'skipkeys': false,
        'ensure_ascii': true,
        'check_circular': true,
        'allow_nan': true,
        'sort_keys': false,
        'indent': 0,
        'separators': [', ', ': '],
        'default': null,
    }
    if (args !== undefined) {
        for (let arg of args) {
            enc[keywords.shift()] = arg
        }
    }

    if (kwargs === undefined) {
        kwargs = {}
    }
    // TODO how to best iterate over JSDict
    for (var key in kwargs.valueOf()) {
        if (kwargs.hasOwnProperty(key)) {
            if (!enc.hasOwnProperty(key)) {
                throw new exceptions.TypeError.$pyclass(
                    // TODO lie! there is no __init__
                    "__init__() got an unexpected keyword argument '"
                    + key + "'"
                )
            }
            if (keywords.indexOf(key) < 0) {
                throw new exceptions.TypeError.$pyclass(
                    "__init__() got mutliple values for argument '"
                    + key + "'"
                )
            }
        }
    }

    var ret = new JSONEncoder()
    Object.assign(ret, enc, kwargs)

    // TODO(abonie) this is artificial
    var len = ret.separators.length
    if (len < 2) {
        throw new exceptions.ValueError.$pyclass(
            'need more than ' + len + (len === 0 ? ' values' : ' value') +
            ' to unpack'
        )
    } else if (len > 2) {
        throw new exceptions.ValueError.$pyclass(
            'too many values to unpack (expected 2)'
        )
    }
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
    // TODO(abonie): use iterencode once it is implemented as an actual generator
    // TODO(abonie): detect circular structure

    return make_encode(
        this.skipkeys,
        this.ensure_ascii,
        this.check_circular,
        this.allow_nan,
        this.sort_keys,
        this.indent,
        this.item_separator,
        this.key_separator,
        this.default,
    )(obj, 1)
}

var make_encode = function(
    skipkeys,
    ensure_ascii,
    check_circular,
    allow_nan,
    sort_keys,
    indent,
    item_separator,
    key_separator,
    default_
) {
    var indentstr
    if (!indent) {
        indentstr = function() { return '' }
    } else if (types.isinstance(indent, types.Str)) {
        indentstr = function(lvl) { return '\n' + indent.repeat(lvl) }
    } else {
        indentstr = function(lvl) { return '\n' + ' '.repeat(lvl * indent) }
    }

    return function _encode(obj, indent_level) {
        var ret = encodeBasicType(obj, ensure_ascii, allow_nan)

        // TODO(abonie): separate function for encoding lists and dicts for readability
        if (ret === null) {
            var current_indent = indentstr(indent_level)
            if (types.isinstance(obj, [types.List, types.Tuple])) {
                var str_contents = []
                for (let elem of obj) {
                    str_contents.push(_encode(elem, indent_level + 1))
                }

                if (str_contents.length == 0) {
                    ret = '[]'
                } else {
                    ret = [
                        '[' + current_indent,
                        str_contents.join(item_separator + current_indent),
                        indentstr(indent_level - 1) + ']',
                    ].join('')
                }
            } else if (types.isinstance(obj, types.Dict)) {
                var str_contents = []
                for (let kv of callables.call_method(obj, 'items')) {
                    var key = encodeKey(kv[0], ensure_ascii, allow_nan)
                    if (key !== null) {
                        str_contents.push(
                            key + key_separator + _encode(kv[1], indent_level + 1)
                        )
                    } else if (!skipkeys) {
                        throw new exceptions.TypeError.$pyclass(
                            'keys must be a string'
                        )
                    }
                }

                if (str_contents.length == 0) {
                    ret = '{}'
                } else {
                    ret = [
                        '{' + current_indent,
                        str_contents.join(item_separator + current_indent),
                        indentstr(indent_level - 1) + '}',
                    ].join('')
                }
            } else if (default_) {
                ret = callables.call_function(default_, obj)
            } else {
                throw new exceptions.TypeError.$pyclass(
                    obj.toString() + ' is not JSON serializable'
                )
            }
        }

        return new types.Str(ret)
    }

}

const transFloat = {
    'nan': 'NaN',
    'inf': 'Infinity',
    '-inf': '-Infinity',
}

var encodeBasicType = function(o, ensure_ascii, allow_nan) {
    if (types.isinstance(o, types.Str)) {
        return JSON.stringify(o)
    }

    if (types.isinstance(o, [types.Int, types.Float])) {
        // TODO(abonie): is relying on toString ok?
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
        return o ? 'true' : 'false'
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

json.dumps = function(args, kwargs) {
    var obj = args[0]
    // TODO(abonie): cache JSONEncoder with default args?
    var encoder = _JSONEncoder()
    return encoder.encode(obj)
}

json.dumps.$pyargs = true

module.exports = json
