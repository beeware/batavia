
/*************************************************************************
 * get the argument type name as a string
 *************************************************************************/

batavia.type_name = function(arg) {
    var type_name;

    switch (typeof arg) {
        case 'boolean':
            type_name = 'bool';
            break;
        case 'number':
            type_name = 'Native number';
            break;
        case 'string':
            type_name = 'str';
            break;
        case 'object':
            if (arg === null || arg === batavia.types.NoneType) {
                type_name = 'NoneType';
            } else if (arg instanceof batavia.types.List) {
                type_name = 'list';
            } else if (arg instanceof batavia.types.Tuple) {
                type_name = 'tuple';
            } else if (arg instanceof batavia.types.Dict) {
                type_name = 'dict';
            } else if (arg instanceof batavia.types.Int) {
                type_name = 'int';
            } else if (arg instanceof batavia.types.Bool) {
                type_name = 'bool';
            } else if (arg instanceof batavia.types.Float) {
                type_name = 'float';
            } else if (arg instanceof batavia.types.Complex) {
                type_name = 'complex';
            } else if (arg instanceof batavia.types.FrozenSet) {
                type_name = 'frozenset';
            } else if (arg instanceof batavia.types.Set) {
                type_name = 'set';
            } else if (arg instanceof batavia.types.Bytes) {
                type_name = 'bytes';
            } else if (arg instanceof batavia.types.ByteArray) {
                type_name = 'bytearray';
            } else {
                type_name = 'Native object';
            }
    }

    return type_name;
};


batavia.types.Type = function() {
    function Type(name) {
        this.name = name;
    }

    Type.prototype = Object.create(Object.prototype);

    Type.prototype.toString = function() {
        return this.name;
    };

    Type.prototype.__str__ = function() {
        return this.toString();
    };

    Type.prototype.valueOf = function() {
        return this.prototype;
    };

    Type.prototype.constructor = Type;

    return Type;
}();
