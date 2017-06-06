var PyObject = require('../core').Object
var create_pyclass = require('../core').create_pyclass
var callables = require('../core').callables
var types = require('../types')
var builtins = require('../builtins')

var json = {
    __doc__: '',  // TODO
    __file__: 'batavia/modules/json.js',
    __name__: 'json',
    __package__: '',  // TODO
    JSONEncoder: JSONEncoder
}

function JSONEncoder(args, kwargs) {
    PyObject.call(this)

    // TODO(abonie): handle args/kwargs
    // TODO(abonie): initialize defaults
}

create_pyclass(JSONEncoder, 'JSONEncoder')

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
        // FIXME(abonie): this does not work, somehow returns capitalized True/False
        if (obj.valueOf()) {
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
        return new types.Str(
            ['[', obj.map(this.encode).join(', '), ']'].join('')
        )
    }

    if (types.isinstance(obj, types.Dict)) {
        var str_contents = []
        var that = this
        callables.iter_for_each(builtins.iter([obj.items()], null), function(kv) {
            str_contents.push(kv.map(that.encode).join(': '))
        })
        return new types.Str(
            ['{', str_contents.join(', '), '}'].join('')
        )
    }

    // TODO(abonie) try running this.default on obj
}

json.dumps = function(obj) {
    // TODO(abonie): use JSONEncoder
}

module.exports = json
