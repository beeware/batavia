var types = require('./Type');

module.exports = function () {
    function DictView(args, kwargs) {
        types.Object.call(this);
    }

    DictView.prototype.__class__ = new types.Type('dictview');

    return DictView;
}();
