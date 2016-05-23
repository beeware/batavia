
/*************************************************************************
 * get the argument type name as a string
 *************************************************************************/

batavia.get_type_name = function(arg) {
    var type_name = 'NoneType';

    switch (typeof arg) {
        case 'boolean':
            type_name = 'bool';
            break;
        case 'number':
            type_name = 'int';
            break;
        case 'string':
            type_name = 'str';
            break;
        case 'object':
            if (arg instanceof batavia.types.List) {
                type_name = 'list';
            } else if (arg instanceof batavia.types.Tuple) {
                type_name = 'tuple';
            } else if (arg instanceof batavia.types.Float) {
                type_name = 'float';
            }
    }

    return type_name;
};
