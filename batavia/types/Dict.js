/*************************************************************************
 * A Python dict type
 *************************************************************************/

batavia.types.Dict = function() {
    function Dict(args, kwargs) {
        Object.call(this);
        if (args) {
            this.update(args);
        }
    }

    Dict.prototype = Object.create(Object.prototype);

    Dict.prototype.update = function(values) {
        for (var key in values) {
            if (values.hasOwnProperty(key)) {
                this[key] = values[key];
            }
        }
    };

    Dict.prototype.copy = function() {
        return new Dict(this);
    };

    Dict.prototype.items = function() {
        var result = [];
        for (var key in this) {
            if (this.hasOwnProperty(key)) {
                result.push([key, this[key]]);
            }
        }
        return result;
    };

    Dict.prototype.toString = function () {
        return this.__str__();
    };

    Dict.prototype.__str__ = function () {
        var result = "{", values = [];
        for (var key in this) {
            if (this.hasOwnProperty(key)) {
                values.push(batavia.builtins.repr([key], null) + ": " + batavia.builtins.repr([this[key]], null));
            }
        }
        result += values.join(', ');
        result += "}";
        return result;
    };

    Dict.prototype.constructor = Dict;

    return Dict;
}();
