var types = {}

types['Type'] = require('./core').Type;
types['PyObject'] = require('./core').Object;
types['NoneType'] = require('./core').NoneType;
types['NotImplementedType'] = require('./core').NotImplementedType;

types['Code'] = require('./types/Code');
types['Module'] = require('./types/Module');
types['JSDict'] = require('./types/JSDict');

types['SetIterator'] = require('./types/SetIterator');

types['Bool'] = require('./types/Bool');
types['Float'] = require('./types/Float');
types['Int'] = require('./types/Int');

types['Dict'] = require('./types/Dict');
types['List'] = require('./types/List');
types['Set'] = require('./types/Set');
types['Tuple'] = require('./types/Tuple');
types['FrozenSet'] = require('./types/FrozenSet');

types['Str'] = require('./types/Str');
types['Bytes'] = require('./types/Bytes');
types['Bytearray'] = require('./types/Bytearray');

types['Complex'] = require('./types/Complex');

types['DictView'] = require('./types/DictView');
types['Ellipsis'] = require('./types/Ellipsis');

types['filter'] = require('./types/Filter');
types['map'] = require('./types/Map');

types['Function'] = require('./types/Function');
types['Method'] = require('./types/Method');

types['Generator'] = require('./types/Generator');

types['Range'] = require('./types/Range');
types['Slice'] = require('./types/Slice');

/*************************************************************************
 * Type comparison defintions that match Python-like behavior.
 *************************************************************************/

types.isinstance = function(obj, type) {
    if (type instanceof Array) {
        for (var t in type) {
            if (types.isinstance(obj, type[t])) {
                return true;
            }
        }
        return false;
    } else {
        switch (typeof obj) {
            case 'boolean':
                return type === types.Bool;
            case 'number':
                return type === types.Int;
            case 'string':
                return type === types.Str;
            case 'object':
                return obj instanceof type;
            default:
                return false;
        }
    }
}

types.isbataviainstance = function(obj) {
    return types.isinstance(obj, [
        types.Bool, types.Dict, types.Float,
        types.Int, types.JSDict, types.List,
        types.NoneType, types.Tuple, types.Slice,
        types.Bytes, types.Bytearray, types.Type,
        types.Str, types.Set, types.Range,
        types.FrozenSet, types.Complex,
        types.NotImplementedType
    ]);
}

types.issubclass = function(cls, type) {
    var t;
    if (type instanceof Array) {
        for (t in type) {
            if (types.issubclass(cls, type[t])) {
                return true;
            }
        }
        return false;
    } else {
        switch (typeof cls) {
            case 'boolean':
                return type === Bool;
            case 'number':
                return type === Int;
            case 'string':
                return type === Str;
            case 'object':
                if (type === null || type === types.NoneType) {
                    return cls === null;
                } else {
                    var mro = cls.mro();
                    for (t in mro) {
                        if (type != null && type.prototype != null && mro[t] === type.prototype.__class__) {
                            return true;
                        }
                    }
                }
                return false;
            default:
                return false;
        }
    }
}

types.js2py = function(arg) {
    var types = require('./types');

    if (Array.isArray(arg)) {
        // recurse
        var arr = new types.List();
        for (var i = 0; i < arg.length; i++) {
            arr.append(types.js2py(arg[i]));
        }
        return arr;
    }

    switch (typeof arg) {
        case 'boolean':
            return arg;
        case 'number':
            if (Number.isInteger(arg)) {
                return new types.Int(arg);
            } else {
              return new types.Float(arg);
            }
        case 'string':
            return new types.Str(arg);
        case 'object':
            if (arg === null || arg === types.NoneType) {
                return null;
            } else if (arg.__class__ != null && arg.__class__.__name__) {
                // already a Python object
                return arg;
            } else {
                // this is a generic object; turn it into a dictionary
                var dict = new types.Dict();
                for (var k in arg) {
                    if (arg.hasOwnProperty(k)) {
                        dict[types.js2py(k)] = types.js2py(arg[k])
                    }
                }
                return dict;
            }
        default:
            throw new exceptions.BataviaError("Unknown type " + (typeof arg));
    }
}

module.exports = types;
