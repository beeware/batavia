/*************************************************************************
 * A Python dict type
 *************************************************************************/

batavia.types.Dict = function() {
    function Dict(args, kwargs) {
        batavia.types.JSDict.call(this, args, kwargs);
    }

    Dict.prototype = Object.create(batavia.types.JSDict.prototype);
    Dict.prototype.__class__ = new batavia.types.Type('dict');

    return Dict;
}();
