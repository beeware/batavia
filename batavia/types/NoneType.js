
batavia.types.NoneType = {
    /**************************************************
     * Type conversions
     **************************************************/

    __bool__: function() {
        return false;
    },

    __repr__: function() {
        return 'None';
    },

    __str__: function() {
        return 'None';
    },

    /**************************************************
     * Comparison operators
     **************************************************/

    __le__: function(args, kwargs) {
        return false;
    },

    __eq__: function(args, kwargs) {
        return args[0] === null;
    },

    __ne__: function(args, kwargs) {
        return args[0] !== null;
    },

    __gt__: function(args, kwargs) {
        return false;
    },

    __ge__: function(args, kwargs) {
        return false;
    },

    __contains__: function(args, kwargs) {
        return false;
    }
};
