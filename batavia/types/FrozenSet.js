
/*************************************************************************
 * A Python FrozenSet type
 *************************************************************************/

batavia.types.FrozenSet = function() {
    function FrozenSet(args, kwargs) {
        batavia.types.Set.call(this, args, kwargs);
    }

    FrozenSet.prototype = Object.create(batavia.types.Set.prototype);

    FrozenSet.prototype.constructor = FrozenSet;
    FrozenSet.__name__ = 'frozenset';
    
    return FrozenSet;
}();
