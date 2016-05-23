
/*************************************************************************
 * Modify Boolean to behave like a Python bool
 *************************************************************************/

Boolean.prototype.__repr__ = function(args, kwargs) {
    return this.__str__();
};

Boolean.prototype.__str__ = function(args, kwargs) {
    if (this.valueOf()) {
        return "true";
    } else {
        return "false";
    }
};

Boolean.prototype.__bool__ = function() {
    return this.valueOf();
};

batavia.types.Bool = Boolean;
