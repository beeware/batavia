
batavia.core.exception = function(name) {
    var Exception = function() {
        this.args = arguments;
    };

    Exception.prototype.toString = function() {
        return name + ": " + this.args[0];
    };

    return Exception;
};

batavia.core.BataviaError = batavia.core.exception('BataviaError');
