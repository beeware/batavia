
/*************************************************************************
 * Modify Boolean to behave like a Python bool
 *************************************************************************/

batavia.types.Bool = Boolean;

/**************************************************
 * Type conversions
 **************************************************/

Boolean.prototype.__bool__ = function() {
    return this.valueOf();
};

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

/**************************************************
 * Comparison operators
 **************************************************/

Boolean.prototype.__le__ = function(args, kwargs) {
    return this.valueOf() <= args[0];
};

Boolean.prototype.__eq__ = function(args, kwargs) {
    return this.valueOf() == args[0];
};

Boolean.prototype.__ne__ = function(args, kwargs) {
    return this.valueOf() != args[0];
};

Boolean.prototype.__gt__ = function(args, kwargs) {
    return this.valueOf() > args[0];
};

Boolean.prototype.__ge__ = function(args, kwargs) {
    return this.valueOf() >= args[0];
};

Boolean.prototype.__contains__ = function(args, kwargs) {
    return false;
};
