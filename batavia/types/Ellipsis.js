var types = require('./Type');

module.exports = function () {
    function Ellipsis(args, kwargs) {
        types.Object.call(this);
    }

    Ellipsis.prototype.__class__ = new types.Type('ellipsis');

    return Ellipsis;
}();
