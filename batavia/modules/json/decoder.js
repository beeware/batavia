var types = require('../../types')
var core = require('../../core')
var PyObject = core.Object
var exceptions = core.exceptions
var callables = core.callables
var version = core.version
var validateParams = require('./utils').validateParams

function JSONDecoder() {
    PyObject.call(this)
}

core.create_pyclass(JSONDecoder, 'JSONDecoder')

// TODO(abonie): actual defaults?
const decoder_defaults = {
    'object_hook': null,
    'parse_float': null,
    'parse_int': null,
    'parse_constant': null,
    'object_pairs_hook': null
}

function _JSONDecoder(args = [], kwargs = {}) {
    var keywords = [
        'object_hook',
        'parse_float',
        'parse_int',
        'parse_constant',
        'strict',
        'object_pairs_hook'
    ]
    var params = validateParams({
        args: args,
        kwargs: kwargs,
        names: keywords,
        defaults: Object.assign({'strict': true}, decoder_defaults),
        funcName: 'JSONDecoder'
    })

    var dec = new JSONDecoder()
    Object.assign(dec, params)

    return dec
}

_JSONDecoder.$pyargs = true

JSONDecoder.prototype.decode = function(s) {
    // TODO(abonie): what if call to object_hook changes decoder's object_hook property?
    var object_hook = this.object_hook
    var reviver = (k, v) => types.js2py(v)
    if (object_hook !== null && !types.isinstance(object_hook, types.NoneType)) {
        reviver = function(k, v) {
            var o = types.js2py(v)
            if (types.isinstance(o, types.Dict)) {
                o = callables.call_function(object_hook, [o], null)
            }
            return o
        }
    }

    var ret
    try {
        ret = JSON.parse(s, reviver)
    } catch (e) {
        if (version.earlier('3.5a0')) {
            throw new exceptions.ValueError.$pyclass(e.message)
        } else {
            throw new exceptions.JSONDecodeError.$pyclass(e.message)
        }
    }
    return ret
}

var loads = function(args, kwargs) {
    var keywords = [
        's',
        'encoding',
        'cls',
        'object_hook',
        'parse_float',
        'parse_int',
        'parse_constant',
        'object_pairs_hook'
    ]
    var params = validateParams({
        args: args,
        kwargs: kwargs,
        names: keywords,
        defaults: Object.assign({'encoding': null, 'cls': _JSONDecoder}, decoder_defaults),
        numRequired: 1,
        funcName: 'loads'
    })
    var cls = params['cls']
    var s = params['s']
    delete params['cls']
    delete params['s']
    delete params['encoding']
    params['strict'] = true

    var dec = callables.call_function(cls, [], params)
    return callables.call_method(dec, 'decode', [s])
}

loads.$pyargs = true

var load = function(args, kwargs) {
    var keywords = [
        'fp',
        'cls',
        'object_hook',
        'parse_float',
        'parse_int',
        'parse_constant',
        'object_pairs_hook'
    ]
    var params = validateParams({
        args: args,
        kwargs: kwargs,
        names: keywords,
        defaults: Object.assign({'cls': _JSONDecoder}, decoder_defaults),
        numRequired: 1,
        funcName: 'load'
    })

    var fp = params['fp']
    delete params['fp']

    var s = callables.call_method(fp, 'read', [])
    return loads([s], params)
}

load.$pyargs = true

module.exports = {
    'loads': loads,
    'load': load,
    'JSONDecodeError': exceptions.JSONDecodeError,
    'JSONDecoder': _JSONDecoder
}
