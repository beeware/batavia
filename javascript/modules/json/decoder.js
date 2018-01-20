import { call_function, call_method } from '../../core/callables'
import { Exception, ValueError } from '../../core/exceptions'
import { create_pyclass, PyObject } from '../../core/types'
import * as version from '../../core/version'

import * as types from '../../types'

import { validateParams } from './utils'

class JSONDecodeError extends PyObject {}
create_pyclass(JSONDecodeError, 'JSONDecodeError', [Exception])

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

class JSONDecoder extends PyObject {
    decode(s) {
        // TODO(abonie): what if call to object_hook changes decoder's object_hook property?
        var object_hook = this.object_hook
        var reviver = (k, v) => types.js2py(v)
        if (object_hook !== null && !types.isinstance(object_hook, types.PyNoneType)) {
            reviver = function(k, v) {
                var o = types.js2py(v)
                if (types.isinstance(o, types.PyDict)) {
                    o = call_function(object_hook, [o], null)
                }
                return o
            }
        }

        var ret
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

    var dec = call_function(cls, [], params)
    return call_method(dec, 'decode', [s])
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

    var s = call_method(fp, 'read', [])
    return loads([s], params)
}

load.$pyargs = true

export {
    loads,
    load,
    JSONDecodeError,
    _JSONDecoder as JSONDecoder
}
