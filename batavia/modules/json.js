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
    var seplen = ret.separators.length
    if (seplen < 2) {
        throw new exceptions.ValueError.$pyclass(
            'need more than ' + seplen + (seplen === 0 ? ' values' : ' value') +
            ' to unpack'
        )
    } else if (ret.separators.length > 2) {
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

    if (types.isinstance(obj, types.Str)) {
        return new types.Str(JSON.stringify(obj))  // TODO(abonie): escaped?
    }

    if (types.isinstance(obj, types.NoneType)) {
        return new types.Str('null')
    }

    if (types.isinstance(obj, types.Bool)) {
        if (obj) {
            return new types.Str('true')
        } else {
            return new types.Str('false')
        }
    }

    if (types.isinstance(obj, types.Int) || types.isinstance(obj, types.Float)) {
        // TODO(abonie): are floats handled correctly?
        return obj.toString() // TODO(abonie): this or __str__?
    }

    if (types.isinstance(obj, types.List) || types.isinstance(obj, types.Tuple)) {
        var str_contents = []
        for (let elem of obj) {
            str_contents.push(this.encode(elem))
        }

        return new types.Str(
            ['[', str_contents.join(this.item_separator), ']'].join('')
        )
    }

    if (types.isinstance(obj, types.Dict)) {
        var str_contents = []
        for (let kv of callables.call_method(obj, 'items')) {
            str_contents.push(
                this.encode(kv[0]) + this.key_separator + this.encode(kv[1])
            )
        }
        return new types.Str(
            ['{', str_contents.join(this.item_separator), '}'].join('')
        )
    }

    if (this.default) {
        callables.call_function(this.default, obj)
    } else {
        throw new exceptions.TypeError.$pyclass(
            obj.toString() + ' is not JSON serializable'
        )
    }
}

json.dumps = function(args, kwargs) {
    var obj = args[0]
    // TODO(abonie): cache JSONEncoder with default args?
    var encoder = _JSONEncoder()
    return encoder.encode(obj)
}

json.dumps.$pyargs = true

module.exports = json
